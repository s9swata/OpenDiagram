"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import type { ChatStatus, UIMessage } from "ai";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { env } from "@OpenDiagram/env/web";
import type { DiagramSpec, RenderSkeleton, ThemeName } from "@OpenDiagram/harness";
import { applyDiagramToCanvas } from "@/lib/excalidraw-utils";
import { orchestrateWorkspaceRequest, runProjectChatAgent } from "@/lib/workspace-agents";
import { updateProjectFile, type RepoGenerationJob } from "@/lib/projects-client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<ChatMessage>;
  return (
    typeof message.id === "string" &&
    (message.role === "user" || message.role === "assistant") &&
    typeof message.text === "string"
  );
}

function uiMessageText(message: UIMessage) {
  return message.parts
    .filter(
      (part): part is Extract<UIMessage["parts"][number], { type: "text" }> => part.type === "text",
    )
    .map((part) => part.text)
    .join("")
    .trim();
}

function uiMessageToChatMessage(message: UIMessage): ChatMessage | null {
  if (message.role !== "user" && message.role !== "assistant") return null;
  const text = uiMessageText(message);
  return text ? { id: message.id, role: message.role, text } : null;
}

function chatMessageToUIMessage(message: ChatMessage): UIMessage {
  return {
    id: message.id,
    role: message.role,
    parts: [{ type: "text", text: message.text }],
  };
}

function normalizeHistory(history?: unknown[]) {
  return (history ?? []).flatMap((entry) => {
    if (isChatMessage(entry)) return [entry];
    if (
      entry &&
      typeof entry === "object" &&
      "parts" in entry &&
      Array.isArray((entry as UIMessage).parts)
    ) {
      const message = uiMessageToChatMessage(entry as UIMessage);
      return message ? [message] : [];
    }
    return [];
  });
}

function uiMessagesToChatHistory(messages: UIMessage[]) {
  return messages.flatMap((message) => {
    const chatMessage = uiMessageToChatMessage(message);
    return chatMessage ? [chatMessage] : [];
  });
}

/** Mirror of the server's draw_diagram tool output (apps/server lib/agent/tools.ts). */
interface DrawDiagramOutput {
  skeletons: RenderSkeleton[];
  rawElements: unknown[];
  summary: { title: string; nodes: number; edges: number; warnings: string[] };
}

interface AskUserInput {
  question: string;
  options: string[];
}

interface AIChatPanelProps {
  activeFileType?: "diagram" | "doc";
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  projectId?: string;
  fileId?: string;
  initialHistory?: unknown[];
  initialSpec?: DiagramSpec;
  /** When true the file already has a saved diagram — skip auto-running the
   *  initial prompt so reopening a file doesn't re-generate the diagram. */
  hasExistingScene?: boolean;
  repoGenerationJob?: RepoGenerationJob | null;
  repoGenerationError?: string | null;
  onCapacityError?: () => void;
}

/** The last assistant message's unanswered ask_user call, if any. */
function pendingAskUser(messages: UIMessage[]) {
  const last = messages.at(-1);
  if (last?.role !== "assistant") return null;
  for (const part of last.parts) {
    if (part.type === "tool-ask_user" && part.state === "input-available") {
      return { toolCallId: part.toolCallId, input: part.input as AskUserInput };
    }
  }
  return null;
}

function diagramRequestLikely(text: string) {
  return /\b(diagram|flowchart|sequence|architecture|system flow|request flow|data flow|canvas|whiteboard|draw|sketch|map)\b/i.test(
    text,
  );
}

function firstUserMessage(messages?: ChatMessage[]) {
  return messages?.find((message) => message.role === "user") ?? null;
}

async function fetchDiagramChat(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, { ...init, credentials: "include" });
  if (response.ok) return response;

  const data = await response.json().catch(() => null);
  throw new Error(data?.error ?? "The diagram agent is unavailable. Try again.");
}

function isQuotaOrCapacityError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("quota") ||
    normalized.includes("capacity") ||
    normalized.includes("rate limit") ||
    normalized.includes("429") ||
    normalized.includes("painters are chilling")
  );
}

export function AIChatPanel({
  activeFileType,
  excalidrawAPI,
  projectId,
  fileId,
  initialHistory,
  initialSpec,
  hasExistingScene,
  repoGenerationJob,
  repoGenerationError,
  onCapacityError,
}: AIChatPanelProps) {
  const currentSpecRef = useRef<DiagramSpec | undefined>(initialSpec);
  const frameByTitleRef = useRef(new Map<string, string>());
  const appliedToolCallsRef = useRef(new Set<string>());
  // Serializes canvas applies: each one reads and rewrites the whole scene, so
  // two in flight at once would clobber each other's elements.
  const applyChainRef = useRef<Promise<void>>(Promise.resolve());
  const normalizedHistory = normalizeHistory(initialHistory);
  const initialDiagramMessages =
    activeFileType === "diagram" ? normalizedHistory.map(chatMessageToUIMessage) : [];
  const messageIdRef = useRef(normalizedHistory.length);
  const autoDiagramPrompt =
    activeFileType === "diagram" ? firstUserMessage(normalizedHistory) : null;
  const [projectMessages, setProjectMessages] = useState<ChatMessage[]>(
    activeFileType === "diagram" ? [] : normalizedHistory,
  );
  const [projectStatus, setProjectStatus] = useState<ChatStatus>("ready");
  const [projectError, setProjectError] = useState<string | null>(null);
  const [themeName, setThemeName] = useState<ThemeName>("sketch");
  // Ref mirror so the transport's body() closure always reads the live value.
  const themeRef = useRef<ThemeName>(themeName);
  themeRef.current = themeName;
  const [applyError, setApplyError] = useState<string | null>(null);

  const {
    messages: diagramMessages,
    sendMessage,
    addToolOutput,
    setMessages: setDiagramMessages,
    status: diagramStatus,
    error: diagramError,
  } = useChat({
    messages: initialDiagramMessages,
    transport: new DefaultChatTransport({
      api: `${env.NEXT_PUBLIC_SERVER_URL}/api/diagram/chat`,
      body: () => ({ currentSpec: currentSpecRef.current, theme: themeRef.current }),
      fetch: fetchDiagramChat,
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onFinish: ({ messages }) => {
      if (!projectId || !fileId) return;
      void updateProjectFile(projectId, fileId, { history: uiMessagesToChatHistory(messages) });
    },
  });

  useEffect(() => {
    const nextHistory = normalizeHistory(initialHistory);
    messageIdRef.current = nextHistory.length;
    setProjectMessages(activeFileType === "diagram" ? [] : nextHistory);
    setDiagramMessages(activeFileType === "diagram" ? nextHistory.map(chatMessageToUIMessage) : []);
    currentSpecRef.current = initialSpec;
    frameByTitleRef.current.clear();
    appliedToolCallsRef.current.clear();
  }, [activeFileType, fileId, initialHistory, initialSpec, setDiagramMessages]);

  useEffect(() => {
    if (!diagramError?.message || !isQuotaOrCapacityError(diagramError.message)) return;
    onCapacityError?.();
  }, [diagramError, onCapacityError]);

  useEffect(() => {
    // Seed history from create-project already includes the user prompt — that is
    // NOT a completed turn. Only skip when an assistant reply exists or the file
    // already has a rendered scene (reopen).
    const hasAssistant = diagramMessages.some((message) => message.role === "assistant");
    if (!autoDiagramPrompt || !excalidrawAPI || hasAssistant || hasExistingScene) return;

    const key = `opendiagram:auto-diagram:${projectId ?? "guest"}:${fileId ?? "file"}:${autoDiagramPrompt.id}`;
    if (window.sessionStorage.getItem(key)) return;

    window.sessionStorage.setItem(key, "1");

    // History was seeded with this user message — replace it (messageId) so we
    // don't double-append the same prompt before calling /api/diagram/chat.
    const seedMessage = diagramMessages.find(
      (message) => message.role === "user" && uiMessageText(message) === autoDiagramPrompt.text,
    );
    void sendMessage(
      seedMessage
        ? { text: autoDiagramPrompt.text, messageId: seedMessage.id }
        : { text: autoDiagramPrompt.text },
    );
  }, [
    autoDiagramPrompt,
    diagramMessages,
    excalidrawAPI,
    fileId,
    hasExistingScene,
    projectId,
    sendMessage,
  ]);

  // Apply each finished draw_diagram call to the canvas exactly once. If the
  // agent redraws a diagram it already drew (same title), the old frame is
  // replaced in place; otherwise the new frame lands beside existing content.
  useEffect(() => {
    if (!excalidrawAPI) return;
    for (const message of diagramMessages) {
      if (message.role !== "assistant") continue;
      for (const part of message.parts) {
        if (part.type !== "tool-draw_diagram" || part.state !== "output-available") continue;
        if (appliedToolCallsRef.current.has(part.toolCallId)) continue;
        appliedToolCallsRef.current.add(part.toolCallId);

        const spec = part.input as DiagramSpec;
        const output = part.output as DrawDiagramOutput;
        const toolCallId = part.toolCallId;
        currentSpecRef.current = spec;
        applyChainRef.current = applyChainRef.current.then(() =>
          // replaceFrameId is resolved inside the chain so it sees frame ids
          // recorded by the apply that ran just before this one.
          applyDiagramToCanvas(excalidrawAPI, output.skeletons, output.rawElements, {
            replaceFrameId: frameByTitleRef.current.get(spec.title) ?? null,
          })
            .then(({ frameId }) => {
              if (frameId) frameByTitleRef.current.set(spec.title, frameId);
              if (projectId && fileId) {
                window.setTimeout(() => {
                  void updateProjectFile(projectId, fileId, { spec });
                }, 0);
              }
            })
            .catch((err: unknown) => {
              // Un-mark so the next messages update can retry after a
              // transient failure instead of dropping the diagram forever.
              appliedToolCallsRef.current.delete(toolCallId);
              setApplyError(err instanceof Error ? err.message : "Failed to draw on canvas");
            }),
        );
      }
    }
  }, [diagramMessages, excalidrawAPI, fileId, projectId]);

  const answerAskUser = useCallback(
    (toolCallId: string, answer: string) => {
      addToolOutput({ tool: "ask_user", toolCallId, output: answer });
    },
    [addToolOutput],
  );

  const runProjectChat = useCallback(
    async (text: string) => {
      if (!projectId) return false;

      const userMessage: ChatMessage = {
        id: `msg-${messageIdRef.current++}`,
        role: "user",
        text,
      };
      setProjectMessages((prev) => [...prev, userMessage]);
      setProjectStatus("submitted");
      setProjectError(null);

      try {
        const result = await runProjectChatAgent({ text, projectId });
        setProjectMessages((prev) => {
          const updated = [
            ...prev,
            {
              id: `msg-${messageIdRef.current++}`,
              role: "assistant" as const,
              text: result.message,
            },
          ];

          if (fileId) {
            window.setTimeout(() => {
              const history =
                activeFileType === "diagram"
                  ? [...uiMessagesToChatHistory(diagramMessages), ...updated]
                  : updated;
              void updateProjectFile(projectId, fileId, { history });
            }, 0);
          }

          return updated;
        });
        setProjectStatus("ready");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Project chat failed";
        if (isQuotaOrCapacityError(message)) onCapacityError?.();
        setProjectMessages((prev) => [
          ...prev,
          { id: `msg-${messageIdRef.current++}`, role: "assistant", text: `Error: ${message}` },
        ]);
        setProjectError(message);
        setProjectStatus("ready");
      }

      return true;
    },
    [activeFileType, diagramMessages, fileId, onCapacityError, projectId],
  );

  const handleSubmit = useCallback(
    async (msg: PromptInputMessage) => {
      const text = msg.text.trim();
      const status = projectStatus !== "ready" ? projectStatus : diagramStatus;
      if (!text || (status !== "ready" && status !== "error")) return;

      setApplyError(null);
      const pending = pendingAskUser(diagramMessages);
      if (pending) {
        answerAskUser(pending.toolCallId, text);
        return;
      }

      let useProjectChat = Boolean(projectId) && !diagramRequestLikely(text);
      if (projectId && excalidrawAPI) {
        try {
          const route = await orchestrateWorkspaceRequest({ text, projectId });
          useProjectChat = route.intent === "project_chat";
        } catch {
          useProjectChat = !diagramRequestLikely(text);
        }
      }

      if (useProjectChat) {
        await runProjectChat(text);
        return;
      }

      if (!excalidrawAPI) {
        await runProjectChat(text);
        return;
      }

      void sendMessage({ text });
    },
    [
      answerAskUser,
      diagramMessages,
      diagramStatus,
      excalidrawAPI,
      projectId,
      projectStatus,
      runProjectChat,
      sendMessage,
    ],
  );

  const messagesEmpty = projectMessages.length === 0 && diagramMessages.length === 0;
  const submitStatus = projectStatus !== "ready" ? projectStatus : diagramStatus;

  return (
    <div className="flex min-h-0 flex-1 flex-col border-l border-od-border-soft bg-white text-od-ink">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="flex flex-col gap-4 px-4 py-4">
          <RepoGenerationProgress
            error={repoGenerationError ?? null}
            job={repoGenerationJob ?? null}
          />
          {messagesEmpty ? (
            <ConversationEmptyState
              title="Start a conversation"
              description={
                projectId
                  ? "Ask about this project's diagrams, docs, and workspace context."
                  : "Describe your architecture and I'll generate a diagram for you."
              }
              icon={<Sparkles className="size-6 text-muted-foreground" />}
            />
          ) : (
            <>
              {projectMessages.map((message) => (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    <MessageResponse>{message.text}</MessageResponse>
                  </MessageContent>
                </Message>
              ))}
              {diagramMessages.map((message) => (
                <Message key={message.id} from={message.role === "user" ? "user" : "assistant"}>
                  <MessageContent>
                    {message.parts.map((part, i) => renderPart(message, part, i, answerAskUser))}
                  </MessageContent>
                </Message>
              ))}
            </>
          )}
          {(diagramStatus === "submitted" || projectStatus === "submitted") && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              {projectStatus === "submitted" ? "Reading project memory…" : "Thinking…"}
            </div>
          )}
          {diagramStatus === "error" && (
            <p className="text-xs text-od-ink-faint">
              {diagramError?.message ?? "Something went wrong. Try again."}
            </p>
          )}
          {projectError && <p className="text-xs text-od-ink-faint">{projectError}</p>}
          {applyError && (
            <p className="text-xs text-od-ink-faint">Couldn't draw on canvas — {applyError}</p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="shrink-0 border-t border-od-border-soft bg-od-surface p-3">
        <PromptInputProvider>
          <PromptInput
            onSubmit={handleSubmit}
            className="w-full border-od-border-soft bg-white text-od-ink shadow-[0_18px_80px_-56px_rgba(24,24,21,0.35)]"
          >
            <PromptInputBody>
              <PromptInputTextarea
                placeholder="Ask, plan, or generate a diagram…"
                className="min-h-32 max-h-40 resize-none text-od-ink placeholder:text-od-ink-faint"
              />
            </PromptInputBody>
            <PromptInputFooter>
              <Select value={themeName} onValueChange={(v) => setThemeName(v as ThemeName)}>
                <SelectTrigger className="h-7 w-30 text-xs" aria-label="Diagram theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sketch">Sketch</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                </SelectContent>
              </Select>
              <p className="flex-1 pr-2 text-right text-xs text-od-ink-faint">
                {projectStatus === "submitted" ? "Reading project memory" : "Picasso"}
              </p>
              <PromptInputSubmit status={submitStatus} />
            </PromptInputFooter>
          </PromptInput>
        </PromptInputProvider>
      </div>
    </div>
  );
}

function RepoGenerationProgress({
  error,
  job,
}: {
  error: string | null;
  job: RepoGenerationJob | null;
}) {
  if (!job && !error) return null;

  const activeTask = job?.tasks.find((task) => task.status === "active");

  return (
    <div className="mb-2 rounded-[12px] border border-od-border-soft bg-white p-3 shadow-[0_12px_36px_-28px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-2">
        {job?.status === "done" ? (
          <CheckCircle2 className="size-5 text-od-green" />
        ) : error || job?.status === "failed" ? (
          <span className="grid size-5 place-items-center rounded-full bg-red-50 text-[11px] font-semibold text-red-600">
            !
          </span>
        ) : (
          <Loader2 className="size-5 animate-spin text-od-ink" />
        )}
        <div className="min-w-0">
          <p className="truncate text-[12px] font-medium text-od-ink">
            {error ?? job?.message ?? "Generating repository files"}
          </p>
          {job && job.status !== "done" && job.status !== "failed" && (
            <p className="text-[11px] text-od-ink-faint">
              {activeTask?.message ?? "Preparing agents"}
            </p>
          )}
        </div>
      </div>

      {job?.tasks.length ? (
        <div className="mt-3 grid gap-1.5">
          {job.tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 text-[11px] text-od-ink-muted">
              <span
                className={`size-1.5 rounded-full ${
                  task.status === "complete"
                    ? "bg-od-green"
                    : task.status === "active"
                      ? "bg-od-ink"
                      : task.status === "failed"
                        ? "bg-red-500"
                        : "bg-od-border-soft"
                }`}
              />
              <span className="min-w-0 flex-1 truncate">{task.name}</span>
              <span className="shrink-0 text-od-ink-faint">{task.status}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function renderPart(
  message: UIMessage,
  part: UIMessage["parts"][number],
  index: number,
  answerAskUser: (toolCallId: string, answer: string) => void,
) {
  const key = `${message.id}-${index}`;

  if (part.type === "text") {
    return part.text ? <MessageResponse key={key}>{part.text}</MessageResponse> : null;
  }

  if (part.type === "tool-ask_user") {
    const input = part.input as AskUserInput | undefined;
    if (!input?.question) return null;
    const answered = part.state === "output-available" ? (part.output as string) : null;
    return (
      <div key={key} className="space-y-2">
        <p className="text-sm">{input.question}</p>
        <div className="flex flex-wrap gap-1.5">
          {(input.options ?? []).map((option) => (
            <Button
              key={option}
              size="sm"
              variant={answered === option ? "default" : "outline"}
              className="h-7 text-xs"
              disabled={answered !== null}
              onClick={() => answerAskUser(part.toolCallId, option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (part.type === "tool-draw_diagram") {
    const title = (part.input as Partial<DiagramSpec> | undefined)?.title;
    if (part.state === "output-available") {
      const summary = (part.output as DrawDiagramOutput).summary;
      return (
        <div key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-primary" />
          <span>
            {summary.title} — {summary.nodes} nodes, {summary.edges} edges
          </span>
        </div>
      );
    }
    if (part.state === "output-error") {
      return (
        <p key={key} className="text-xs text-od-ink-faint">
          Drawing failed: {part.errorText}
        </p>
      );
    }
    return (
      <div key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="size-3 animate-spin" />
        Drawing {title ? `“${title}”` : "diagram"}…
      </div>
    );
  }

  return null;
}
