import type { Metadata } from "next";
import Image from "next/image";
import { Check, MousePointer2, Sparkles } from "lucide-react";
import { MarketingPage, PageCta, PageIntro } from "@/components/marketing/marketing-page";

export const metadata: Metadata = {
  title: "Examples — Editable AI Architecture Diagrams",
  description:
    "See a real OpenDiagram architecture draft, the prompt that created it, and the captured editing sequence used to refine it.",
  alternates: { canonical: "/examples" },
  openGraph: {
    type: "website",
    url: "/examples",
    title: "Real OpenDiagram Examples",
    description:
      "A real system-design prompt, generated architecture draft, and captured canvas edit—shown without concept art.",
    images: [
      {
        url: "/example-media/collaborative-ai-workspace.jpg",
        width: 1280,
        height: 720,
        alt: "Collaborative AI workspace architecture diagram edited in OpenDiagram",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/example-media/collaborative-ai-workspace.jpg"],
  },
};

const prompt =
  "Design a production-ready collaborative AI architecture workspace with a Next.js web app, Hono API, authentication, PostgreSQL, an AI model gateway, a diagram rendering engine, object storage, and an event queue. Show the main request and data flows.";

export default function ExamplesPage() {
  return (
    <MarketingPage>
      <PageIntro
        eyebrow="Made in OpenDiagram"
        title={
          <>
            Real drafts. Real edits. <span className="font-serif italic">No concept art.</span>
          </>
        }
        description="This example was created in an OpenDiagram guest workspace, refined on the canvas, and captured directly from the running product."
      />

      <section className="px-2 pb-20 md:px-6 lg:px-10">
        <div className="mx-auto max-w-[1424px] overflow-hidden rounded-[28px] border border-black/10 bg-white p-2 shadow-[0_40px_100px_-70px_rgba(0,0,0,0.8)] md:p-4">
          <video
            className="aspect-video w-full rounded-[20px] border border-black/10 bg-[#f7f7f7] object-cover"
            controls
            loop
            muted
            playsInline
            preload="metadata"
            poster="/example-media/collaborative-ai-workspace.jpg"
            aria-label="Editing an architecture diagram in OpenDiagram"
          >
            <source src="/example-media/collaborative-ai-workspace-edit.webm" type="video/webm" />
            <source src="/example-media/collaborative-ai-workspace-edit.mp4" type="video/mp4" />
          </video>
          <div className="flex flex-col gap-3 px-3 pb-2 pt-5 text-sm text-black/55 md:flex-row md:items-center md:justify-between md:px-4">
            <span>5.5-second capture · silent · recorded in the local product</span>
            <span>No account or repository data used</span>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 lg:px-[120px]">
        <div className="mx-auto grid w-full max-w-[1200px] gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="font-serif text-2xl italic">The input</p>
            <h2 className="mt-4 text-[44px] font-normal leading-[1.08] -tracking-[0.05em] md:text-[64px]">
              One concrete system-design prompt.
            </h2>
          </div>
          <blockquote className="rounded-[28px] bg-black p-8 text-white md:p-12">
            <Sparkles className="h-6 w-6 text-white/55" aria-hidden="true" />
            <p className="mt-10 text-balance text-2xl leading-[1.45] -tracking-[0.025em] md:text-3xl">
              “{prompt}”
            </p>
          </blockquote>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 lg:px-[120px]">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-14 max-w-[760px]">
            <p className="font-serif text-2xl italic">From draft to reviewed artifact</p>
            <h2 className="mt-4 text-balance text-[44px] font-normal leading-[1.08] -tracking-[0.05em] md:text-[64px]">
              Generation starts the work. The canvas keeps it honest.
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                number: "01",
                title: "Describe",
                text: "The prompt names the runtime, API, identity, data stores, AI gateway, asynchronous work, and the flows that matter.",
              },
              {
                number: "02",
                title: "Generate",
                text: "OpenDiagram produced a nine-node architecture draft with the web, backend, AI, rendering, and storage boundaries visible.",
              },
              {
                number: "03",
                title: "Edit",
                text: "The captured edit adds an Observability + traces node on the actual canvas—an operational concern missing from the first draft.",
              },
            ].map((step) => (
              <article
                key={step.number}
                className="flex min-h-[330px] flex-col justify-between rounded-[24px] border border-black/10 bg-white/65 p-8"
              >
                <span className="font-serif text-2xl italic text-black/30">{step.number}</span>
                <div>
                  <h3 className="text-2xl font-semibold">{step.title}</h3>
                  <p className="mt-4 leading-[1.75] text-black/60">{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 lg:px-[120px]">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="grid gap-4 lg:grid-cols-2">
            <figure className="overflow-hidden rounded-[24px] border border-black/10 bg-white p-2">
              <Image
                src="/example-media/collaborative-ai-workspace-before.jpg"
                alt="First architecture draft generated in OpenDiagram"
                width={1280}
                height={720}
                className="h-auto w-full rounded-[18px] border border-black/10"
              />
              <figcaption className="flex items-center gap-2 px-4 py-4 text-sm text-black/55">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Generated draft
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-[24px] border border-black/10 bg-white p-2">
              <Image
                src="/example-media/collaborative-ai-workspace.jpg"
                alt="Architecture draft after adding an observability and traces node"
                width={1280}
                height={720}
                className="h-auto w-full rounded-[18px] border border-black/10"
              />
              <figcaption className="flex items-center gap-2 px-4 py-4 text-sm text-black/55">
                <MousePointer2 className="h-4 w-4" aria-hidden="true" />
                Canvas edit captured
              </figcaption>
            </figure>
          </div>

          <div className="mt-6 rounded-[24px] border border-black/10 bg-white/50 p-8 md:flex md:items-center md:justify-between md:gap-8">
            <div className="flex items-start gap-3">
              <Check className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <p className="max-w-[760px] leading-[1.75] text-black/65">
                This is a working architecture draft, not an authoritative production design. An
                engineer should still review security boundaries, failure modes, scaling
                assumptions, and operational requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PageCta
        eyebrow="Create the next field note"
        title="Start with a system you actually need to explain."
        description="Use a real constraint, generate the first draft, and edit what the model could not know."
      />
    </MarketingPage>
  );
}
