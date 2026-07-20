import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

export function MarketingPage({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-od-canvas text-od-ink">
      <Header />
      <main className="overflow-hidden">{children}</main>
      <Footer />
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: Readonly<{
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}>) {
  return (
    <section className="px-6 pb-16 pt-24 md:px-12 md:pb-24 md:pt-32 lg:px-[120px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center text-center">
        <p className="mb-8 inline-flex items-center gap-4 font-serif text-xl italic md:text-2xl">
          <span className="h-px w-10 bg-black/35 md:w-[69px]" />
          {eyebrow}
          <span className="h-px w-10 bg-black/35 md:w-[69px]" />
        </p>
        <h1 className="max-w-[1050px] text-balance text-[52px] font-normal leading-[0.98] -tracking-[0.065em] md:text-[82px] lg:text-[104px]">
          {title}
        </h1>
        <p className="mt-8 max-w-[720px] text-balance text-lg leading-[1.7] text-black/65 md:text-xl">
          {description}
        </p>
      </div>
    </section>
  );
}

export function PageCta({
  eyebrow,
  title,
  description,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
}>) {
  return (
    <section className="px-2 py-3">
      <div className="mx-auto flex min-h-[520px] w-full max-w-[1424px] flex-col items-center justify-center rounded-[28px] bg-white px-6 py-20 text-center md:px-12">
        <p className="font-serif text-xl italic text-black/60">{eyebrow}</p>
        <h2 className="mt-5 max-w-[850px] text-balance text-[44px] font-normal leading-[1.04] -tracking-[0.055em] md:text-[72px]">
          {title}
        </h2>
        <p className="mt-6 max-w-[620px] text-balance text-lg leading-[1.7] text-black/60">
          {description}
        </p>
        <Link
          href="/dashboard"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/75"
        >
          Create your first diagram
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
