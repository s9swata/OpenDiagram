import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import type { SaveStatus } from "./helpers";

type WorkspaceHeaderProps = {
  activeFileName: string;
  isAgentOpen: boolean;
  isEditingName: boolean;
  isSignedIn: boolean;
  isSidebarOpen: boolean;
  nameDraft: string;
  projectName: string;
  saveError: string | null;
  saveStatus: SaveStatus;
  hasWorkspace: boolean;
  onBeginEditName: () => void;
  onCancelName: () => void;
  onCommitName: () => void;
  onNameDraftChange: (value: string) => void;
  onOpenAgent: () => void;
  onOpenSidebar: () => void;
  onSignIn: () => void;
};

export function WorkspaceHeader({
  activeFileName,
  isAgentOpen,
  isEditingName,
  isSignedIn,
  isSidebarOpen,
  nameDraft,
  projectName,
  saveError,
  saveStatus,
  hasWorkspace,
  onBeginEditName,
  onCancelName,
  onCommitName,
  onNameDraftChange,
  onOpenAgent,
  onOpenSidebar,
  onSignIn,
}: WorkspaceHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-od-border-soft bg-white px-4">
      <div className="flex min-w-0 items-center gap-3">
        {!isSidebarOpen && hasWorkspace && (
          <button
            type="button"
            onClick={onOpenSidebar}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] border border-od-border-soft text-od-ink-faint transition hover:bg-od-canvas/45 hover:text-od-ink"
            aria-label="Open workspace sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        )}
        <div className="min-w-0">
          <p className="truncate text-[11px] uppercase tracking-[0.16em] text-od-ink-faint">
            {projectName}
          </p>
          {isEditingName ? (
            <input
              autoFocus
              value={nameDraft}
              onChange={(event) => onNameDraftChange(event.target.value)}
              onBlur={onCommitName}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
                else if (event.key === "Escape") onCancelName();
              }}
              className="rounded-[6px] border border-od-border-soft px-1.5 py-0.5 text-[14px] font-medium text-od-ink outline-none focus:border-od-ink"
            />
          ) : (
            <button
              type="button"
              onClick={onBeginEditName}
              title="Rename file"
              className="-mx-1.5 block max-w-full truncate rounded-[6px] px-1.5 py-0.5 text-left text-[15px] font-semibold text-od-ink transition hover:bg-od-canvas/40"
            >
              {activeFileName}
            </button>
          )}
        </div>
      </div>
      {hasWorkspace && (
        <div className="flex shrink-0 items-center gap-3">
          {!isAgentOpen && (
            <button
              type="button"
              onClick={onOpenAgent}
              className="grid h-8 w-8 place-items-center rounded-[8px] border border-od-border-soft text-od-ink-faint transition hover:bg-od-canvas/45 hover:text-od-ink"
              aria-label="Open agent panel"
            >
              <PanelRightOpen className="h-4 w-4" />
            </button>
          )}
          {saveStatus === "saving" && (
            <p className="hidden text-[12px] text-amber-500 sm:block">Saving…</p>
          )}
          {saveStatus === "saved" && (
            <p className="hidden text-[12px] text-od-green sm:block">Saved</p>
          )}
          {saveStatus === "error" && (
            <p className="hidden text-[12px] text-red-500 sm:block">Save failed</p>
          )}
          {!isSignedIn && <p className="hidden text-[12px] text-od-ink-faint sm:block">Guest</p>}
          {saveError && (
            <p className="hidden max-w-[260px] truncate text-[12px] text-red-600 sm:block">
              {saveError}
            </p>
          )}
          {!isSignedIn && (
            <button
              type="button"
              onClick={onSignIn}
              className="h-8 rounded-[8px] bg-od-ink px-3 text-[12px] font-medium text-white"
            >
              Sign in to save
            </button>
          )}
        </div>
      )}
    </header>
  );
}
