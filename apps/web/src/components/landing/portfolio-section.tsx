export function PortfolioSection() {
  return (
    <section className="flex w-full flex-col items-center justify-center px-[120px] max-md:px-6">
      <div className="flex h-[120vh] w-full max-w-[1440px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#262626]">
        <div className="relative flex h-full w-full items-center justify-center">
          <a
            href="/"
            className="absolute left-1/2 top-1/2 z-10 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-all hover:scale-110"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              <path d="M12 11v6" />
              <path d="M9 14h6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
