"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "How does the GitHub integration work?",
    answer:
      "Connect your GitHub account, select a repository, and Open Diagram automatically scans your codebase to generate architecture diagrams, README, API docs, and more.",
  },
  {
    question: "Can I use it with private repositories?",
    answer:
      "Yes. Open Diagram supports both public and private repositories. Your code is never stored on our servers after analysis.",
  },
  {
    question: "What types of documentation can I generate?",
    answer:
      "Architecture diagrams, README files, API documentation, data flow diagrams, component maps, changelogs, and more.",
  },
  {
    question: "Is there a free plan available?",
    answer:
      "Yes, we offer a free tier with basic features. Premium plans unlock unlimited diagrams, priority support, and advanced customization.",
  },
  {
    question: "How accurate are the generated diagrams?",
    answer:
      "Open Diagram uses advanced AI to understand your codebase structure. Diagrams are highly accurate, and you can always fine-tune them.",
  },
];

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ question, answer, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-black/10 pb-6">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left text-lg font-semibold"
      >
        {question}
        <svg
          className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <p className="text-base leading-[1.7] text-black/70">{answer}</p>
      )}
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="flex w-full flex-col items-center justify-center px-[120px] max-md:px-6">
      <div className="flex w-full max-w-[1440px] flex-col items-center gap-[60px] pb-[160px] pt-[120px]">
        <div className="flex w-full flex-col items-center gap-2.5 overflow-hidden">
          <div className="relative z-10 inline-flex items-center gap-6 rounded-full px-6">
            <span className="h-px w-[69px] bg-black/50" />
            <span className="font-serif text-2xl italic">FAQ</span>
            <span className="h-px w-[69px] bg-black/50" />
          </div>
          <h2 className="w-full text-center text-[48px] font-bold leading-[1.4] -tracking-[0.04em] max-md:text-3xl">
            Your Questions, Answered
          </h2>
        </div>

        <div className="flex w-full items-start gap-20 max-md:flex-col">
          <div className="flex w-full max-w-[400px] -rotate-2 flex-col gap-20 rounded-2xl bg-white/50 p-10 max-md:max-w-full">
            <div className="flex items-center gap-6">
              <img
                src="https://framerusercontent.com/images/zRVCa2eOgJIf1mJK5PYcBLrYI.png"
                alt=""
                className="h-20 w-20 rounded-full"
              />
              <h3 className="text-2xl font-bold leading-[1.6] -tracking-[0.02em]">
                Have more questions? Talk to us on Discord
              </h3>
            </div>
            <div className="flex w-full flex-col items-center gap-6">
              <div className="inline-flex w-full items-center gap-6 rounded-[33px] bg-white p-2">
                <a
                  href="https://discord.gg"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Join Our Discord
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
              <a
                href="mailto:hello@opendiagram.dev"
                className="text-base leading-[1.7] underline underline-offset-2"
              >
                Or, email me at hello@opendiagram.dev
              </a>
            </div>
          </div>

          <div className="flex w-full flex-col gap-9" style={{ paddingTop: "36px" }}>
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
