"use client";

interface SkillChipProps {
  label: string;
  rotation: number;
  className?: string;
}

function SkillChip({ label, rotation, className = "" }: SkillChipProps) {
  return (
    <div
      className={`absolute inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {label}
    </div>
  );
}

export function IntroSection() {
  return (
    <section className="flex w-full flex-col items-center justify-center overflow-hidden px-[120px] max-md:px-6">
      <div className="relative flex min-h-screen w-full max-w-[1366px] flex-col items-center justify-center py-20">
        <div className="relative z-10 inline-flex items-center gap-6 rounded-full px-6">
          <span className="h-px w-[69px] bg-black/50" />
          <span className="font-serif text-2xl italic">Hello!</span>
          <span className="h-px w-[69px] bg-black/50" />
        </div>

        <div className="relative flex w-full max-w-[940px] flex-col items-center gap-12 px-[120px] py-12 max-md:px-6">
          <p className="text-center text-[48px] font-bold leading-[1.4] -tracking-[0.04em] max-md:text-3xl">
            We help open source projects turn complex codebases into clear,
            beautiful documentation that contributors actually read
          </p>

          <SkillChip label="Architecture Diagrams" rotation={4} className="right-[-78px] bottom-[52px] max-md:hidden" />
          <SkillChip label="API Docs" rotation={4} className="left-[-57px] top-1/2 -translate-y-1/2 max-md:hidden" />
          <SkillChip label="README" rotation={-4} className="right-[-98px] top-1/2 -translate-y-1/2 max-md:hidden" />
          <SkillChip label="Data Flow" rotation={-5} className="right-[-92px] top-[51px] max-md:hidden" />
          <SkillChip label="Changelogs" rotation={-4} className="bottom-[51px] left-[-75px] max-md:hidden" />
          <SkillChip label="Component Maps" rotation={3} className="left-[-120px] top-[62px] max-md:hidden" />
        </div>
      </div>
    </section>
  );
}
