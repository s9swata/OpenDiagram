import type { Metadata } from "next";
import { FeatureMedia } from "@/components/marketing/feature-media";
import { FeatureNav } from "@/components/marketing/feature-nav";
import { MarketingPage } from "@/components/marketing/marketing-page";

export const metadata: Metadata = {
  title: "Features — AI Architecture Diagram Workspace",
  description:
    "Generate editable software architecture diagrams, import GitHub repositories, refine systems with AI, and keep engineering documents beside the canvas.",
  alternates: { canonical: "/features" },
  openGraph: {
    type: "website",
    url: "/features",
    title: "OpenDiagram Features",
    description:
      "From a system prompt or GitHub repository to an editable architecture diagram and connected engineering context.",
    images: [
      {
        url: "/dashboard-od.png",
        alt: "OpenDiagram dashboard for starting an architecture diagram",
      },
    ],
  },
};

const showcaseItems = [
  {
    id: "prompt",
    label: "Generate",
    title: "Prompt to architecture draft",
    description:
      "Describe system behavior, scale, constraints, and technologies in plain language. OpenDiagram maps that intent into services and flows.",
    media: {
      kind: "video" as const,
      src: "/hero-media/opendiagram-creation-flow-trimmed.webm",
      fallback: "/hero-media/opendiagram-creation-flow-trimmed.mp4",
      poster: "/hero-media/opendiagram-creation-flow-poster.jpg",
      alt: "OpenDiagram demo showing an architecture workspace creation flow",
    },
  },
  {
    id: "canvas",
    label: "Shape",
    title: "A real editing canvas",
    description:
      "Move components, rename services, redraw connections, and add the details the first draft missed. The result is a diagram, not an image.",
    media: {
      kind: "image" as const,
      src: "/dashboard-od.png",
      alt: "OpenDiagram dashboard showing the editable architecture canvas",
    },
  },
  {
    id: "context",
    label: "Keep context close",
    title: "Diagrams and documents",
    description:
      "Keep system notes, architecture decisions, API context, and implementation guidance in the same project workspace.",
    media: {
      kind: "image" as const,
      src: "/example-media/collaborative-ai-workspace.jpg",
      alt: "Collaborative AI architecture workspace diagram in OpenDiagram",
    },
  },
  {
    id: "ownership",
    label: "Ground and own",
    title: "GitHub import and open source",
    description:
      "Connect GitHub and choose a repository to begin from project structure, then run the Apache 2.0 codebase on infrastructure you control.",
    media: {
      kind: "image" as const,
      src: "/example-media/collaborative-ai-workspace-before.jpg",
      alt: "Initial architecture draft generated from a system design prompt",
    },
  },
];

export default function FeaturesPage() {
  return (
    <MarketingPage className="bg-white">
      <section className="px-6 pb-20 pt-20 md:px-12 md:pb-28 md:pt-28 lg:px-[120px]">
        <div className="mx-auto w-full max-w-[1200px]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#ff4a2c]">
            Why Open Diagram
          </p>
          <h1 className="mt-8 max-w-[980px] text-balance text-[46px] font-medium leading-[0.94] -tracking-[0.065em] md:text-[70px] lg:text-[88px]">
            From system intent to an <span className="text-[#ff4a2c]">editable map.</span>
          </h1>
        </div>
      </section>

      <section className="px-6 pb-28 md:px-12 lg:px-[120px]">
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 lg:grid-cols-[0.3fr_0.7fr] lg:gap-14">
          <aside className="h-fit lg:sticky lg:top-24 lg:self-start">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.16em] text-black/45">
              Explore the workspace
            </p>
            <FeatureNav items={showcaseItems.map(({ id, title }) => ({ id, title }))} />
          </aside>

          <div className="min-w-0">
            <p className="mb-10 max-w-[560px] text-lg leading-[1.7] text-black/62 md:text-xl">
              Open Diagram combines AI diagram generation, a visual editor, repository context, and
              engineering documents in one architecture workspace.
            </p>

            <div className="space-y-24 lg:space-y-36">
              {showcaseItems.map((item) => (
                <article
                  key={item.id}
                  id={item.id}
                  className="scroll-mt-24 border-t border-black/15 pt-8"
                >
                  <div className="mb-8 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#ff4a2c]">
                        {item.label}
                      </p>
                      <h2 className="mt-4 text-balance text-[34px] font-medium leading-[1] -tracking-[0.045em] md:text-[48px]">
                        {item.title}
                      </h2>
                    </div>
                    <p className="max-w-[450px] leading-[1.7] text-black/58 md:justify-self-end">
                      {item.description}
                    </p>
                  </div>

                  <div className="bg-[#eeeaf7] p-3 md:p-6 lg:p-8">
                    <FeatureMedia media={item.media} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
