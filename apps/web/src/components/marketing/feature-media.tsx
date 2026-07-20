"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type FeatureMediaProps =
  | {
      kind: "video";
      src: string;
      fallback: string;
      poster: string;
      alt: string;
    }
  | { kind: "image"; src: string; alt: string };

export function FeatureMedia({ media }: { media: FeatureMediaProps }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (media.kind !== "video" || !videoRef.current) return;
    const video = videoRef.current;
    void video.play().catch(() => undefined);
  }, [media]);

  if (media.kind === "video") {
    return (
      <video
        ref={videoRef}
        className="aspect-video w-full rounded-[18px] bg-[#1d1d1b] object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={media.poster}
        aria-label={media.alt}
      >
        <source src={media.src} type="video/webm" />
        <source src={media.fallback} type="video/mp4" />
      </video>
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      width={1920}
      height={1080}
      sizes="(min-width: 1024px) 65vw, 100vw"
      className="h-auto w-full rounded-[18px]"
    />
  );
}
