import type { Metadata } from "next";
import Image from "next/image";
import { Bot, Boxes, FileText, GitBranch, MessageSquareText, ServerCog } from "lucide-react";
import { MarketingPage, PageCta, PageIntro } from "@/components/marketing/marketing-page";

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

const features = [
  {
    icon: MessageSquareText,
    title: "Prompt to architecture draft",
    description:
      "Describe system behavior, scale, constraints, and technologies in plain language. OpenDiagram maps that intent into services and flows.",
  },
  {
    icon: Boxes,
    title: "A real editing canvas",
    description:
      "Move components, rename services, redraw connections, and add the details the first draft missed. The result is a diagram, not an image.",
  },
  {
    icon: GitBranch,
    title: "GitHub repository import",
    description:
      "Connect GitHub and choose a repository to begin a diagram grounded in project structure instead of a blank page.",
  },
  {
    icon: Bot,
    title: "Iterative AI workflow",
    description:
      "Keep the agent next to the canvas. Ask for a first draft, inspect it, and continue the conversation as the architecture changes.",
  },
  {
    icon: FileText,
    title: "Diagrams and documents",
    description:
      "Keep system notes, architecture decisions, API context, and implementation guidance in the same project workspace.",
  },
  {
    icon: ServerCog,
    title: "Open source and self-hostable",
    description:
      "Run the Apache 2.0 codebase on infrastructure you control and configure the AI and data services for your environment.",
  },
];

export default function FeaturesPage() {
  return (
    <MarketingPage>
      <PageIntro
        eyebrow="OpenDiagram features"
        title={
          <>
            From system intent to an <span className="font-serif italic">editable map.</span>
          </>
        }
        description="OpenDiagram combines AI diagram generation, a visual editor, repository context, and engineering documents in one architecture workspace."
      />

      <section className="px-2 pb-20 md:px-6 lg:px-10">
        <div className="mx-auto max-w-[1424px] overflow-hidden rounded-[28px] border border-black/10 bg-white p-2 shadow-[0_40px_100px_-70px_rgba(0,0,0,0.8)] md:p-4">
          <Image
            src="/dashboard-od.png"
            alt="OpenDiagram dashboard for creating a new AI architecture diagram"
            width={1920}
            height={1080}
            priority
            className="h-auto w-full rounded-[20px] border border-black/10"
          />
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 lg:px-[120px]">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
            <div>
              <p className="font-serif text-2xl italic">What you can do today</p>
              <h2 className="mt-4 text-balance text-[44px] font-normal leading-[1.08] -tracking-[0.05em] md:text-[64px]">
                One workspace for the diagram and the reasoning behind it.
              </h2>
            </div>
            <p className="max-w-[520px] justify-self-end text-lg leading-[1.75] text-black/60">
              Each capability supports the same workflow: describe the system, inspect the visual
              draft, and keep refining until it reflects the design you can defend.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="group flex min-h-[350px] flex-col justify-between rounded-[24px] border border-black/10 bg-white/65 p-8 transition-colors hover:bg-white"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-serif text-xl italic text-black/30">0{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold -tracking-[0.025em]">{title}</h3>
                  <p className="mt-4 leading-[1.75] text-black/60">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 lg:px-[120px]">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 rounded-[28px] bg-black px-8 py-14 text-white md:px-14 lg:grid-cols-[0.8fr_1.2fr] lg:p-16">
          <p className="font-serif text-2xl italic text-white/65">A clear boundary</p>
          <div>
            <h2 className="text-balance text-[42px] font-normal leading-[1.08] -tracking-[0.05em] md:text-[60px]">
              The first draft is a proposal, not production truth.
            </h2>
            <p className="mt-6 max-w-[700px] text-lg leading-[1.75] text-white/65">
              OpenDiagram helps engineers get to a reviewable visual faster. It does not replace
              architecture review, operational evidence, security analysis, or the people
              accountable for the system.
            </p>
          </div>
        </div>
      </section>

      <PageCta
        eyebrow="Start with the behavior"
        title="Describe the system before arranging the boxes."
        description="Give OpenDiagram the requirements and constraints. Then shape the visual draft on a real canvas."
      />
    </MarketingPage>
  );
}
