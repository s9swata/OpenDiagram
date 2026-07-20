import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Code2, PencilRuler, ShieldCheck } from "lucide-react";
import { MarketingPage, PageCta, PageIntro } from "@/components/marketing/marketing-page";
import { GITHUB_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About OpenDiagram",
  description:
    "Learn why OpenDiagram is building an open-source, editable AI workspace for software architecture and system design.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "/about",
    title: "About OpenDiagram",
    description:
      "An open-source AI workspace where software architecture stays editable, explainable, and owned by engineers.",
  },
};

const principles = [
  {
    icon: PencilRuler,
    title: "Editable from the first draft",
    description:
      "A generated diagram should begin a design conversation, not end it. Every output opens on a canvas where the structure can be reviewed and changed.",
  },
  {
    icon: ShieldCheck,
    title: "Engineer judgment stays in the loop",
    description:
      "OpenDiagram creates working drafts. Engineers still validate constraints, tradeoffs, failure modes, and the architecture that reaches production.",
  },
  {
    icon: Code2,
    title: "Open source first",
    description:
      "The code is available under Apache 2.0. Teams can inspect it, contribute to it, and run the workspace on infrastructure they control.",
  },
];

export default function AboutPage() {
  return (
    <MarketingPage>
      <PageIntro
        eyebrow="Why OpenDiagram exists"
        title={
          <>
            Architecture should stay <span className="font-serif italic">open to change.</span>
          </>
        }
        description="Software systems evolve after the whiteboard meeting. OpenDiagram keeps the diagram, the reasoning, and the editing surface together so architecture can evolve with the code."
      />

      <section className="px-6 pb-24 md:px-12 lg:px-[120px]">
        <div className="mx-auto grid w-full max-w-[1200px] gap-px overflow-hidden rounded-[28px] bg-black/10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-white p-8 md:p-14 lg:p-16">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">
              The problem
            </p>
            <h2 className="mt-6 text-balance text-[38px] font-normal leading-[1.08] -tracking-[0.045em] md:text-[56px]">
              System knowledge gets scattered across screenshots, repositories, documents, and chat
              history.
            </h2>
          </div>
          <div className="flex flex-col justify-between gap-16 bg-[#f4f4f4] p-8 md:p-14 lg:p-16">
            <p className="text-lg leading-[1.75] text-black/65">
              OpenDiagram brings those materials into one architecture workspace. Start from a
              prompt or repository, shape the visual draft, and keep the context close enough for
              the next engineer to understand.
            </p>
            <Link
              href={GITHUB_URL}
              className="inline-flex w-fit items-center gap-2 border-b border-black pb-1 text-sm font-semibold"
            >
              Inspect the source on GitHub
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 lg:px-[120px]">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-14 max-w-[760px]">
            <p className="font-serif text-2xl italic">The principles</p>
            <h2 className="mt-4 text-balance text-[44px] font-normal leading-[1.08] -tracking-[0.05em] md:text-[64px]">
              Useful architecture tools should make thinking visible.
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {principles.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="flex min-h-[390px] flex-col justify-between rounded-[24px] border border-black/10 bg-white/65 p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-black text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-serif text-xl italic text-black/35">0{index + 1}</span>
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
        <div className="mx-auto grid w-full max-w-[1200px] gap-12 border-y border-black/15 py-16 md:grid-cols-[0.8fr_1.2fr]">
          <p className="font-serif text-2xl italic">Built in public</p>
          <div>
            <h2 className="text-balance text-[42px] font-normal leading-[1.08] -tracking-[0.05em] md:text-[60px]">
              The roadmap is visible because the work is still moving.
            </h2>
            <p className="mt-6 max-w-[700px] text-lg leading-[1.75] text-black/60">
              OpenDiagram is in early development. Diagram generation works today, while deeper
              repository grounding, documentation workflows, collaboration, and version history
              continue to evolve in the open.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`${GITHUB_URL}/issues`}
                className="rounded-full border border-black/15 bg-white/60 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white"
              >
                Follow the issues
              </Link>
              <Link
                href={`${GITHUB_URL}/blob/main/LICENSE`}
                className="rounded-full border border-black/15 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/50"
              >
                Read the Apache 2.0 license
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PageCta
        eyebrow="Make the thinking visible"
        title="Turn a system idea into something your team can inspect."
        description="Describe the behavior and constraints. OpenDiagram gives you an editable architecture draft to review and refine."
      />
    </MarketingPage>
  );
}
