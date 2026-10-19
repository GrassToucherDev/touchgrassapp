"use client";

import { Button } from "@/components/ui/Button";
import { SeasonCountdown } from "./SeasonCountdown";
import { formatTokenAmount } from "@/lib/harvest/utils";
import type { SeasonConfig } from "@/lib/harvest/types";

export function HarvestHero({ season }: { season: SeasonConfig }) {
  function scrollToPlant() {
    document.getElementById("plant")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      className="relative overflow-hidden rounded-b-xl3 bg-field bg-cover bg-center px-4 pb-8 pt-8 sm:px-8 sm:pt-10 sm:pb-10"
      style={{ backgroundImage: "url(/brand/meadow.jpg)" }}
    >
      {/* Dark-green wash keeps the meadow on-brand while the text stays readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-field via-field/90 to-field/40"
      />
      {/* WAGO, the Touch Grass mascot, cheering the season on */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/wago-cheer.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-6 hidden h-52 w-auto drop-shadow-xl sm:block md:right-10 md:h-64"
      />
      <div className="relative">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sun">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
        Touch Grass
      </p>
      <h1 className="mt-2 font-display text-5xl font-bold leading-none text-cream sm:text-7xl">
        Harvest
      </h1>
      <p className="mt-3 max-w-lg text-base text-cream/80 sm:text-lg">
        Plant $TOUCHGRASS. Grow together. Harvest together.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-grass-light/25 px-3 py-1 text-xs font-semibold text-grass-light">🌱 Active Season</span>
        <span className="font-display text-lg font-bold text-cream">{season.seasonName}</span>
      </div>
      <p className="mt-2 max-w-md text-sm text-cream/70">{season.description}</p>

      <div className="mt-6" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sun">Total locked in Harvest</p>
        <p className="mt-1 font-display text-4xl font-bold text-cream sm:text-5xl">
          {formatTokenAmount(season.totalLocked)}{" "}
          <span className="text-lg font-bold text-cream/70 sm:text-xl">$TOUCHGRASS</span>
        </p>
        <p className="mt-1 text-xs text-cream/60">
          {formatTokenAmount(season.lockedParticipantCount)} planter
          {season.lockedParticipantCount === 1 ? "" : "s"} · live on-chain
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SeasonCountdown targetIso={season.harvestDate} />
        <Button variant="primary" size="lg" onClick={scrollToPlant} className="w-full sm:w-auto">
          🌾 Plant $TOUCHGRASS
        </Button>
      </div>
      </div>
    </section>
  );
}
