"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { joinWaitlist } from "@/lib/projects-client";
import { WorkspaceAgentSidebar } from "./workspace-layout/WorkspaceAgentSidebar";
import { FirstFileDialog, LeavePromptDialog } from "./workspace-layout/WorkspaceDialogs";
import { WorkspaceEditorPane } from "./workspace-layout/WorkspaceEditorPane";
import { WorkspaceHeader } from "./workspace-layout/WorkspaceHeader";
import { WorkspaceSidebar } from "./workspace-layout/WorkspaceSidebar";
import { useWorkspaceLayoutController } from "./workspace-layout/useWorkspaceLayoutController";

const CHILL_QUOTA_MESSAGE =
  "Our diagram painters are chilling for a minute. Beta capacity got cooked. Try again shortly.";

function CapacityModal({
  isSignedIn,
  waitlistStatus,
  onClose,
  onJoinWaitlist,
}: {
  isSignedIn: boolean;
  waitlistStatus: "idle" | "joining" | "joined" | "error";
  onClose: () => void;
  onJoinWaitlist: () => Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-white px-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="capacity-modal-title"
        className="relative w-full max-w-md rounded-[18px] border border-od-border-soft bg-white p-6 text-center shadow-[0_28px_100px_-42px_rgba(24,24,21,0.35)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-od-ink-faint transition hover:bg-od-canvas/60 hover:text-od-ink"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {isSignedIn && waitlistStatus === "joined" ? (
          <>
            <p id="capacity-modal-title" className="pr-8 text-[15px] font-semibold text-od-ink">
              You&apos;re on the list
            </p>
            <p className="mt-3 text-[13px] leading-6 text-od-ink-muted">
              We&apos;ll notify you when beta capacity opens up. Thanks for your patience.
            </p>
          </>
        ) : isSignedIn ? (
          <>
            <p id="capacity-modal-title" className="pr-8 text-[15px] font-semibold text-od-ink">
              Beta capacity is taking a breather
            </p>
            <p className="mt-3 text-[13px] leading-6 text-od-ink-muted">
              You&apos;ve used all your free diagrams for the beta. Join the waitlist and we&apos;ll
              let you know when we open more capacity.
            </p>
            <button
              type="button"
              disabled={waitlistStatus === "joining"}
              onClick={() => void onJoinWaitlist()}
              className="mt-5 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-od-ink text-[13px] font-medium text-white transition hover:opacity-80 disabled:opacity-50"
            >
              {waitlistStatus === "joining" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {waitlistStatus === "joining" ? "Joining…" : "Join the waitlist"}
            </button>
            {waitlistStatus === "error" && (
              <p className="mt-2 text-[12px] text-od-ink-faint">Could not join. Try again.</p>
            )}
          </>
        ) : (
          <>
            <p id="capacity-modal-title" className="pr-8 text-[15px] font-semibold text-od-ink">
              Beta capacity is taking a breather
            </p>
            <p className="mt-3 text-[13px] leading-6 text-od-ink-muted">{CHILL_QUOTA_MESSAGE}</p>
          </>
        )}
      </div>
    </div>
  );
}

export function WorkspaceLayout() {
  const { state, actions } = useWorkspaceLayoutController();
  const [capacityModalOpen, setCapacityModalOpen] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "joining" | "joined" | "error">(
    "idle",
  );

  async function handleJoinWaitlist() {
    setWaitlistStatus("joining");
    try {
      await joinWaitlist();
      setWaitlistStatus("joined");
    } catch {
      setWaitlistStatus("error");
    }
  }
  const activeHistory = state.activeFile?.history as
    | { id: string; role: "user" | "assistant"; text: string }[]
    | undefined;
  const agentProjectId = state.isSignedIn ? state.activeFile?.projectId : undefined;
  const agentFileId = state.activeFile?.id ?? state.currentFileId ?? undefined;

  return (
    <div className="flex h-full w-full overflow-hidden bg-od-surface text-od-ink">
      {state.isSidebarOpen && (
        <WorkspaceSidebar
          accountImage={state.accountImage}
          accountName={state.accountName}
          activeFileId={state.activeFileId}
          files={state.sidebarFilesForProject}
          isSignedIn={state.isSignedIn}
          onClose={actions.closeSidebar}
          onCreateFile={(type) => void actions.createWorkspaceFile(type)}
          onDeleteFile={(fileId) => void actions.deleteWorkspaceFile(fileId)}
          onOpenFile={actions.openWorkspaceFile}
          onResizeStart={actions.handleResizeStart}
          onSignIn={actions.signInToSave}
          onSignOut={() => void actions.signOut()}
          projectName={state.sidebarProjectName}
          width={state.sidebarWidth}
        />
      )}

      <main className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-white">
        <WorkspaceHeader
          activeFileName={state.activeFileName}
          hasWorkspace={Boolean(state.draft || state.isSignedIn)}
          isAgentOpen={state.isAgentOpen}
          isEditingName={state.isEditingName}
          isSignedIn={state.isSignedIn}
          isSidebarOpen={state.isSidebarOpen}
          nameDraft={state.nameDraft}
          onBeginEditName={actions.beginEditName}
          onCancelName={actions.cancelName}
          onCommitName={() => void actions.commitName()}
          onNameDraftChange={actions.setNameDraft}
          onOpenAgent={actions.openAgent}
          onOpenSidebar={actions.openSidebar}
          onSignIn={actions.signInToSave}
          projectName={state.sidebarProjectName}
          saveError={state.saveError}
          saveStatus={state.saveStatus}
        />
        <WorkspaceEditorPane
          activeFile={state.activeFile}
          docContent={state.docContent}
          initialScene={state.initialScene}
          onDocChange={actions.handleDocChange}
          onExcalidrawAPI={actions.handleExcalidrawAPI}
          onSceneChange={actions.handleSceneChange}
        />
      </main>

      {state.isAgentOpen && (
        <WorkspaceAgentSidebar
          activeFileId={state.activeFile?.id}
          activeFileType={state.activeFile?.type}
          agentWidth={state.agentWidth}
          excalidrawAPI={state.excalidrawAPI}
          fileId={agentFileId}
          initialHistory={activeHistory}
          hasExistingScene={Boolean(
            state.initialScene &&
            typeof state.initialScene === "object" &&
            ((Array.isArray((state.initialScene as any).skeletons) &&
              (state.initialScene as any).skeletons.length > 0) ||
              (Array.isArray((state.initialScene as any).elements) &&
                (state.initialScene as any).elements.some(
                  (el: any) => !el.groupIds?.includes("__opendiagram_welcome__"),
                ))),
          )}
          onClose={actions.closeAgent}
          onCapacityError={() => setCapacityModalOpen(true)}
          onResizeStart={actions.handleResizeStart}
          projectId={agentProjectId}
          repoGenerationError={state.repoGenerationError}
          repoGenerationJob={state.repoGenerationJob}
        />
      )}

      <FirstFileDialog
        firstFileName={state.firstFileName}
        onCancel={actions.cancelFirstFileDialog}
        onNameChange={actions.setFirstFileName}
        onSubmit={(event) => void actions.handleCreateFirstFile(event)}
        open={state.showFirstFileDialog}
      />
      <LeavePromptDialog
        onLeave={actions.leaveWithoutSaving}
        onSignIn={actions.signInToSave}
        open={state.leavePromptOpen}
      />
      {capacityModalOpen && (
        <CapacityModal
          isSignedIn={state.isSignedIn}
          waitlistStatus={waitlistStatus}
          onClose={() => {
            setCapacityModalOpen(false);
            setWaitlistStatus("idle");
          }}
          onJoinWaitlist={handleJoinWaitlist}
        />
      )}
    </div>
  );
}
