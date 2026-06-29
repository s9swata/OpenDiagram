interface ProcessCardProps {
  number: string;
  title: string;
  description: string;
  rotation: number;
}

function ProcessCard({ number, title, description, rotation }: ProcessCardProps) {
  return (
    <div
      className="flex w-full flex-col gap-6 rounded-2xl bg-white/80 p-8 shadow-sm backdrop-blur-sm"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <span className="text-[72px] font-thin leading-[1.25] -tracking-[0.06em]">
        {number}
      </span>
      <h3 className="text-2xl font-bold leading-[1.6] -tracking-[0.02em]">{title}</h3>
      <p className="text-base leading-[1.7] text-black/70">{description}</p>
    </div>
  );
}

interface TestimonyProps {
  paddingTop: string;
  quote: string;
  name: string;
  role: string;
}

function Testimony({ paddingTop, quote, name, role }: TestimonyProps) {
  return (
    <div className="flex w-full flex-col gap-6" style={{ paddingTop }}>
      <p className="text-base leading-[1.7] italic">&ldquo;{quote}&rdquo;</p>
      <div className="flex flex-col">
        <span className="font-semibold">{name}</span>
        <span className="text-sm text-black/50">{role}</span>
      </div>
    </div>
  );
}

export function ProcessSection() {
  return (
    <section className="flex w-full flex-col items-center justify-center px-[120px] max-md:px-6">
      <div className="flex w-full max-w-[1440px] flex-col items-start gap-[60px] py-[120px]">
        <div className="flex w-full flex-col items-center gap-2.5 overflow-hidden">
          <div className="relative z-10 inline-flex items-center gap-6 rounded-full px-6">
            <span className="h-px w-[69px] bg-black/50" />
            <span className="font-serif text-2xl italic">Our Process, Explained</span>
            <span className="h-px w-[69px] bg-black/50" />
          </div>
          <h2 className="w-full text-center text-[48px] font-bold leading-[1.4] -tracking-[0.04em] max-md:text-3xl">
            Here&apos;s how it works
          </h2>
        </div>

        <div className="relative flex w-full items-start gap-6 max-md:flex-col">
          <div className="flex w-full flex-col gap-2.5 pt-[62px] max-md:pt-0">
            <ProcessCard
              number="1"
              title="Connect"
              description="Link your GitHub account and select any public or private repository"
              rotation={-5}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5 max-md:pt-0">
            <ProcessCard
              number="2"
              title="Analyze"
              description="Choose a plan and request as many designs as you need."
              rotation={9}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5 pt-16 max-md:pt-0">
            <ProcessCard
              number="3"
              title="Get Your Designs"
              description="Download architecture diagrams, README, API docs, and everything in between"
              rotation={-3}
            />
          </div>
        </div>

        <div className="flex w-full items-start gap-24 pt-12 max-md:flex-col max-md:gap-12">
          <Testimony
            paddingTop="80px"
            quote="Open Diagram saved us hours of onboarding. New contributors understand our architecture on day one — without us writing a single doc manually."
            name="Sophie Lemaire"
            role="Product Lead at Loomi"
          />
          <span className="h-full w-px bg-black/25 max-md:hidden" />
          <Testimony
            paddingTop="240px"
            quote="We had zero documentation. Open Diagram scanned our repo and generated everything — diagrams, API docs, README. It actually understood our codebase."
            name="Milan Bakker"
            role="Founder of Drifted Studio"
          />
        </div>
      </div>
    </section>
  );
}
