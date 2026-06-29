"use client";

import { useState, useEffect } from "react";

const slideshowImages = [
  "https://framerusercontent.com/images/jSslhcqo8HKNjUvPEceq7bhbY.jpg",
  "https://framerusercontent.com/images/wWjLitV3mnO3fgL2J1WnS6WKDU.jpg",
  "https://framerusercontent.com/images/0Y1cjcOdQp68PBw6G3HHfHz6TYo.jpg",
];

const tickerWords = ["Code", "Docs", "APIs", "Workflows"];

function Slideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slideshowImages.length), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative inline-flex h-[108px] w-[144px] -rotate-2 overflow-hidden rounded-[36px] border-2 border-black bg-black">
      <img
        src={slideshowImages[index]}
        alt=""
        className="h-full w-full object-cover transition-opacity duration-700"
      />
    </div>
  );
}

function Ticker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % tickerWords.length), 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative inline-flex h-[108px] w-[144px] rotate-2 items-center justify-center overflow-hidden rounded-[36px] border-2 border-black bg-[#262626]">
      <span className="text-2xl font-bold text-white transition-all duration-500">
        {tickerWords[index]}
      </span>
    </div>
  );
}

const avatarImages = [
  "https://framerusercontent.com/images/75ILrhKQhUkwU1dH15BUDezAQ.png",
  "https://framerusercontent.com/images/EgbF2rgcHm4Q19cR6VXfj7f5awk.png",
  "https://framerusercontent.com/images/etglVFVv5e7VnmUVyHsNK3oyIbI.png",
  "https://framerusercontent.com/images/Y3PGv0d0lyAiS8gk3emx3d41fvU.png",
  "https://framerusercontent.com/images/kpYj3BEOGRfBZXfMd4dgKyI0.png",
];

export function HeroSection() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center px-[120px] max-md:px-6">
      <div className="flex w-full max-w-[1440px] flex-col items-center gap-12 pb-[118px] pt-[180px] max-md:pt-[120px]">
        <div className="flex w-full max-w-[1000px] flex-col items-center gap-9">
          <div className="inline-flex items-center gap-2 rounded-[382px] border border-white bg-white px-4 py-2">
            <span className="h-[9px] w-[6px] rounded-full bg-green-500" />
            <span className="text-sm">Get Started for free!</span>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-3">
            <h1 className="text-center text-[78px] font-bold leading-[1.15] -tracking-[0.06em] max-md:text-5xl max-sm:text-4xl">
              Open{" "}
            </h1>
            <Slideshow />
            <h1 className="text-center text-[78px] font-bold leading-[1.15] -tracking-[0.06em] max-md:text-5xl max-sm:text-4xl">
              Diagram
            </h1>
            <h1 className="text-center text-[78px] font-bold leading-[1.15] -tracking-[0.06em] max-md:text-5xl max-sm:text-4xl">
              for Every{" "}
            </h1>
            <Ticker />
            <h1 className="text-center text-[78px] font-bold leading-[1.15] -tracking-[0.06em] max-md:text-5xl max-sm:text-4xl">
              Open Source Project
            </h1>
          </div>

          <p className="max-w-[434px] text-center text-base leading-[1.7]">
            We help open source maintainers generate beautiful, accurate
            documentation — fast and automatically.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-6 rounded-[33px] bg-white p-2">
            <a
              href="https://github.com"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Import From GitHub
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

          <div className="flex flex-col items-start gap-0.5">
            <div className="relative h-8 w-[135px]">
              {avatarImages.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="absolute h-[31px] w-[31px] rounded-full border border-white"
                  style={{ left: `${i * 25}px` }}
                />
              ))}
            </div>
            <span className="text-xs">Trusted by Maintainers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
