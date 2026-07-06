import { diagramSpecSchema, themes } from "@OpenDiagram/harness";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import type { EvlogVariables } from "evlog/hono";
import { Hono } from "hono";
import { z } from "zod";
import { buildSystemPrompt } from "../lib/agent/prompt";
import { askUserTool, createDrawDiagramTool } from "../lib/agent/tools";
import {
  createPrimaryModel,
  isProviderCapacityError,
  providerCapacityMessage,
} from "../lib/ai-provider";
import {
  applyCreationQuotaHeaders,
  consumeCreationQuota,
  creationQuotaExceededResponse,
  CreationQuotaExceededError,
  getCreationQuotaActor,
} from "../lib/creation-quota";
import { LLM_MAX_RETRIES } from "../lib/repo-ai";

const chatRequestSchema = z.object({
  // UIMessage shape is owned by the AI SDK and too deep to mirror — validated
  // structurally by convertToModelMessages below.
  messages: z.array(z.looseObject({})).min(1).max(50),
  currentSpec: diagramSpecSchema.optional(),
  theme: z.enum(["classic", "sketch"]).optional(),
});

export const diagramRoute = new Hono<EvlogVariables>();

const CHAT_MAX_OUTPUT_TOKENS = 16384;

diagramRoute.post("/chat", async (c) => {
  const log = c.get("log");
  const body = await c.req.json().catch(() => null);
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid request", issues: parsed.error.issues }, 400);
  }
  const { messages, currentSpec, theme: themeName = "sketch" } = parsed.data;
  const quotaActor = await getCreationQuotaActor(c);

  try {
    const quota = await consumeCreationQuota(quotaActor);
    applyCreationQuotaHeaders(c, quota);
  } catch (error) {
    if (error instanceof CreationQuotaExceededError) {
      return creationQuotaExceededResponse(c, error);
    }
    throw error;
  }

  // convertToModelMessages throws on malformed UIMessage shapes -- that's a bad
  // client payload, not a server fault, so surface it as a 400.
  let modelMessages: Awaited<ReturnType<typeof convertToModelMessages>>;
  try {
    modelMessages = await convertToModelMessages(messages as unknown as UIMessage[]);
  } catch (err) {
    return c.json(
      { error: "Invalid messages", detail: err instanceof Error ? err.message : String(err) },
      400,
    );
  }

  const tools = {
    ask_user: askUserTool,
    draw_diagram: createDrawDiagramTool(log, themes[themeName]),
  };

  const request = {
    instructions: buildSystemPrompt(currentSpec),
    messages: modelMessages,
    tools,
    stopWhen: isStepCount(6),
    maxRetries: LLM_MAX_RETRIES,
    maxOutputTokens: CHAT_MAX_OUTPUT_TOKENS,
    onFinish: ({ steps, totalUsage }: { steps: any[]; totalUsage: { totalTokens?: number } }) => {
      log.set({
        chat: {
          messageCount: messages.length,
          hasCurrentSpec: currentSpec !== undefined,
          theme: themeName,
          steps: steps.length,
          toolCalls: steps.flatMap((s) => s.toolCalls.map((t: { toolName: string }) => t.toolName)),
          totalTokens: totalUsage.totalTokens,
        },
      });
    },
  };

  const result = streamText({ ...request, model: createPrimaryModel() });

  return createUIMessageStreamResponse({
    // `tools` makes tool parts stream as static `tool-<name>` parts (the chat
    // panel matches on those) instead of generic `dynamic-tool` parts.
    stream: toUIMessageStream({
      stream: result.stream,
      tools,
      onError: (error) => {
        if (isProviderCapacityError(error)) return providerCapacityMessage();
        return "The diagram agent is unavailable. Try again.";
      },
    }),
  });
});
