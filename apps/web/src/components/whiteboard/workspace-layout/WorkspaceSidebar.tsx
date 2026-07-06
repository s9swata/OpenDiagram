import { useState, type ComponentType } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  LogIn,
  LogOut,
  PanelLeftClose,
  PenTool,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCreationQuota, type CreationQuota, type SavedProjectFile } from "@/lib/projects-client";
import type { WorkspaceSidebarFile } from "@/lib/workspace-layout-store";
import { getInitials } from "./helpers";

type WorkspaceSidebarProps = {
  accountImage?: string | null;
  accountName: string;
  isSignedIn: boolean;
  files: WorkspaceSidebarFile[];
  activeFileId?: string | null;
  projectName: string;
  width: number;
  onResizeStart: (pane: "sidebar" | "agent", event: React.MouseEvent) => void;
  onCreateFile: (type: SavedProjectFile["type"]) => void;
  onDeleteFile: (fileId: string) => void;
  onOpenFile: (fileId: string) => void;
  onClose: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
};

function getFileIcon(
  type: SavedProjectFile["type"] | "diagram",
): ComponentType<{ className?: string }> {
  return type === "doc" ? FileText : PenTool;
}

export function WorkspaceSidebar({
  accountImage,
  accountName,
  isSignedIn,
  files,
  activeFileId,
  projectName,
  width,
  onResizeStart,
  onCreateFile,
  onDeleteFile,
  onOpenFile,
  onClose,
  onSignIn,
  onSignOut,
}: WorkspaceSidebarProps) {
  const [quota, setQuota] = useState<CreationQuota | null>(null);
  const [quotaError, setQuotaError] = useState<string | null>(null);
  const [quotaPending, setQuotaPending] = useState(false);

  async function handleMenuOpen(open: boolean) {
    if (!open) return;
    setQuotaPending(true);
    setQuotaError(null);
    try {
      setQuota(await getCreationQuota());
    } catch (error) {
      setQuotaError(error instanceof Error ? error.message : "Could not load quota.");
    } finally {
      setQuotaPending(false);
    }
  }

  return (
    <aside
      className="group/sidebar relative hidden h-full shrink-0 flex-col border-r border-od-border-soft bg-od-surface lg:flex"
      style={{ width }}
    >
      <div
        className="absolute inset-y-0 -right-[3px] z-20 w-[6px] cursor-col-resize opacity-0 transition-opacity group-hover/sidebar:opacity-100"
        onMouseDown={(event) => onResizeStart("sidebar", event)}
      >
        <div className="mx-auto h-full w-px bg-od-border-soft" />
      </div>

      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-od-border-soft px-3">
        <Link
          href="/dashboard"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] border border-od-border-soft text-od-ink-faint transition hover:bg-od-canvas/45 hover:text-od-ink"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        {accountImage ? (
          <img
            src={accountImage}
            alt=""
            className="h-8 w-8 rounded-[8px] border border-od-border-soft object-cover"
          />
        ) : (
          <div className="grid h-8 w-8 place-items-center rounded-[8px] bg-od-ink text-[12px] font-semibold text-od-on-dark">
            {getInitials(accountName)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">{accountName}</p>
          <p className="truncate text-[11px] text-od-ink-faint">
            {isSignedIn ? "Signed in" : "Guest session"}
          </p>
        </div>
        <DropdownMenu onOpenChange={(open) => void handleMenuOpen(open)}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account actions"
              className="grid h-8 w-8 place-items-center rounded-[8px] text-od-ink-faint transition hover:bg-od-canvas/60 hover:text-od-ink"
            >
              <Settings className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="space-y-1.5 px-2 py-2">
                <span className="block text-[12px] font-semibold text-od-ink">Beta quota</span>
                {quotaPending ? (
                  <span className="block text-[11px] font-normal text-od-ink-faint">
                    Loading...
                  </span>
                ) : quotaError ? (
                  <span className="block text-[11px] font-normal text-red-600">{quotaError}</span>
                ) : quota ? (
                  <span className="block text-[11px] font-normal leading-4 text-od-ink-muted">
                    {quota.remaining} of {quota.limit} beta creation requests left
                    {quota.actorType === "guest" ? ". Sign in to get 10." : "."}
                  </span>
                ) : (
                  <span className="block text-[11px] font-normal text-od-ink-faint">
                    Open settings to check usage.
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isSignedIn ? (
                <DropdownMenuItem onSelect={onSignOut} className="cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onSelect={onSignIn} className="cursor-pointer">
                  <LogIn className="h-4 w-4" />
                  Sign in
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          type="button"
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-[8px] text-od-ink-faint transition hover:bg-od-canvas/60 hover:text-od-ink"
          aria-label="Collapse workspace sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 py-4">
        <div className="mb-3 flex min-w-0 items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium uppercase tracking-[0.14em] text-od-ink-faint">
              Explorer
            </p>
            <p className="mt-1 truncate text-[14px] font-semibold text-od-ink">{projectName}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Create file"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] text-od-ink-faint transition hover:bg-od-canvas/60 hover:text-od-ink"
              >
                <Plus className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={() => onCreateFile("diagram")} className="cursor-pointer">
                <PenTool className="h-4 w-4" />
                New diagram
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onCreateFile("doc")} className="cursor-pointer">
                <FileText className="h-4 w-4" />
                New doc
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="min-h-0 overflow-y-auto pb-4">
          {files.length === 0 ? (
            <p className="rounded-[8px] px-2 py-2 text-[13px] text-od-ink-faint">No files yet</p>
          ) : (
            <div className="grid gap-0.5">
              {files.map((file) => {
                const Icon = getFileIcon(file.type);
                const active = file.id === activeFileId;

                return (
                  <div
                    key={file.id}
                    className={`group/file flex h-8 items-center rounded-[8px] transition ${
                      active
                        ? "bg-od-canvas/75 text-od-ink"
                        : "text-od-ink-muted hover:bg-od-canvas/45 hover:text-od-ink"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onOpenFile(file.id)}
                      aria-current={active ? "page" : undefined}
                      className="flex h-full min-w-0 flex-1 items-center gap-2 rounded-l-[8px] px-2 text-left text-[13px]"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-od-ink-faint" />
                      <span className="min-w-0 truncate">{file.name}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteFile(file.id)}
                      aria-label={`Delete ${file.name}`}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] text-od-ink-faint opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover/file:opacity-100 focus:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
