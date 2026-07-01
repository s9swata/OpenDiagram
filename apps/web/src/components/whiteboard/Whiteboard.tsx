"use client";

import "@excalidraw/excalidraw/index.css";
import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
// narrowed to real type in Phase 3 when API methods are used
// oxlint-disable-next-line no-explicit-any
type ExcalidrawImperativeAPI = any;

const Excalidraw = dynamic(
  async () => {
    const { Excalidraw } = await import("@excalidraw/excalidraw");
    return Excalidraw;
  },
  { ssr: false, loading: () => <WhiteboardSkeleton /> },
);

function WhiteboardSkeleton() {
  return (
    <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
      <span className="text-muted-foreground text-sm">Loading canvas…</span>
    </div>
  );
}

interface WhiteboardProps {
  onAPIReady?: (api: ExcalidrawImperativeAPI) => void;
}

export function Whiteboard({ onAPIReady }: WhiteboardProps) {
  const [, setAPI] = useState<ExcalidrawImperativeAPI | null>(null);

  const handleAPI = useCallback(
    (api: ExcalidrawImperativeAPI) => {
      setAPI(api);
      onAPIReady?.(api);
    },
    [onAPIReady],
  );

  return (
    <div className="w-full h-full overflow-hidden relative">
      <Excalidraw
        excalidrawAPI={handleAPI}
        UIOptions={{
          canvasActions: {
            saveToActiveFile: false,
            loadScene: false,
          },
        }}
      />
    </div>
  );
}

// Need to redesign it
