"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Topbar } from "@/components/dashboard/topbar";
import { ActionTiles } from "@/components/dashboard/action-tiles";
import { FileTable } from "@/components/dashboard/file-table";
import type { DiagramFile } from "@/components/dashboard/data";

const files: DiagramFile[] = [];

export default function Dashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nav, setNav] = useState("home");
  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-white text-od-ink">
      <SidebarNav active={nav} onSelect={setNav} onCreateDiagram={() => setComposerOpen(true)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
            <ActionTiles
              onCreateDiagram={() => setComposerOpen(true)}
              onConnectProject={() => router.push("/import/github")}
              onImportFile={() => fileInputRef.current?.click()}
            />

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".json,.md,.mmd,.txt,.yaml,.yml"
              onChange={(event) => {
                setSelectedFileName(event.target.files?.[0]?.name ?? null);
              }}
            />

            {composerOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
                onClick={() => setComposerOpen(false)}
              >
                <div
                  className="w-full max-w-[540px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <NewDiagramPanel onClose={() => setComposerOpen(false)} />
                </div>
              </div>
            )}

            {selectedFileName && (
              <ImportedFilePanel
                fileName={selectedFileName}
                onClear={() => {
                  setSelectedFileName(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              />
            )}

            <section className="flex flex-col gap-5">
              <h2 className="text-[20px] text-od-ink">Files</h2>
              <FileTable files={files} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function NewDiagramPanel({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex flex-col gap-5 rounded-[18px] border border-[#d9d9d9] bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-[18px] text-od-ink">New diagram</h3>
          <p className="text-[13px] leading-[1.6] text-od-ink-muted">Name your diagram to get started.</p>
        </div>
        <button type="button" onClick={onClose} className="text-[13px] text-od-ink-faint">
          Close
        </button>
      </div>
      <input
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          setSubmitted(false);
        }}
        placeholder="e.g. My System Architecture"
        className="h-12 rounded-[14px] border border-[#d9d9d9] bg-od-surface px-4 text-[14px] outline-none placeholder:text-od-ink-faint"
      />
      <button
        type="button"
        onClick={() => setSubmitted(true)}
        disabled={name.trim().length === 0}
        className="self-start rounded-full bg-od-ink px-5 py-2.5 text-[14px] text-od-on-dark disabled:opacity-40"
      >
        Create
      </button>
      {submitted && (
        <p className="text-[13px] leading-[1.6] text-od-ink-muted">
          Diagram created. Canvas can be connected when the backend is ready.
        </p>
      )}
    </div>
  );
}

function ImportedFilePanel({ fileName, onClear }: { fileName: string; onClear: () => void }) {
  return (
    <div className="flex flex-col gap-4 rounded-[18px] border border-[#d9d9d9] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-[18px] text-od-ink">File selected</h3>
          <p className="break-all text-[13px] leading-[1.6] text-od-ink-muted">{fileName}</p>
        </div>
        <button type="button" onClick={onClear} className="text-[13px] text-od-ink-faint">
          Clear
        </button>
      </div>
      <p className="text-[13px] leading-[1.6] text-od-ink-muted">
        The file picker is wired. Upload parsing can be connected when the import backend is ready.
      </p>
    </div>
  );
}
