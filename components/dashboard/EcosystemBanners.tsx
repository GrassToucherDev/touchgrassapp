/* Banners linking out to the other Touch Grass apps. Both live on proofofgrass.app. */

export function EcosystemBanners() {
  return (
    <section aria-labelledby="ecosystem-heading">
      <h2 id="ecosystem-heading" className="font-display text-2xl font-bold text-field">
        The Touch Grass ecosystem
      </h2>
      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        {/* Proof of Grass */}
        <a
          href="https://proofofgrass.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex min-h-[200px] overflow-hidden rounded-xl3 bg-field bg-cover bg-center shadow-soft transition-transform duration-200 hover:-translate-y-0.5"
          style={{ backgroundImage: "url(/brand/meadow.jpg)" }}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-field via-field/85 to-field/20" />
          <div className="relative flex flex-1 flex-col justify-between gap-4 p-5 sm:p-6">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
              <h3 className="mt-2 font-display text-3xl font-bold leading-tight text-cream sm:text-4xl">
                Proof of Grass
              </h3>
              <p className="mt-1 max-w-xs text-sm text-cream/85">
                Go outside. Prove it. Build your streak, earn rewards, and make an impact.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[linear-gradient(135deg,#7dc832_0%,#5ba622_100%)] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_24px_rgba(125,200,50,0.3)] transition group-hover:brightness-95">
              Start your streak <span aria-hidden="true">→</span>
            </span>
          </div>
        </a>

        {/* WAGO Drops */}
        <a
          href="https://proofofgrass.app/wago-drops"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex min-h-[200px] overflow-hidden rounded-xl3 bg-[linear-gradient(160deg,#a8d4f0_0%,#d4edf8_45%,#fef3d8_100%)] shadow-soft transition-transform duration-200 hover:-translate-y-0.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/wago-wave.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2 right-2 h-36 w-auto drop-shadow-lg transition-transform duration-200 group-hover:scale-105 sm:right-3 sm:h-52"
          />
          <div className="relative flex flex-1 flex-col justify-between gap-4 p-5 sm:p-6">
            <div className="max-w-[58%] sm:max-w-[62%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/wago-drops-logo.png" alt="WAGO Drops" className="h-14 w-auto" />
              <p className="mt-2 text-sm font-medium text-field-light">
                Real-world treasure hunts on a live map. Find drops, prove you were there, and
                claim on-chain.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[linear-gradient(135deg,#f5c04a_0%,#e8a020_100%)] px-5 py-2.5 text-sm font-bold text-field shadow-softer transition group-hover:brightness-95">
              Find a drop <span aria-hidden="true">→</span>
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
