import { HeroSection } from "./hero-section";
import { PortfolioSection } from "./portfolio-section";
import { IntroSection } from "./intro-section";
import { ProcessSection } from "./process-section";
import { FaqSection } from "./faq-section";

export function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#d9d9d9]">
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "200px",
        }}
      />
      <HeroSection />
      <PortfolioSection />
      <IntroSection />
      <ProcessSection />
      <FaqSection />
    </main>
  );
}
