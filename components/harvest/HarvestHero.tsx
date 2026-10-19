"use client";

import { Button } from "@/components/ui/Button";
import { SeasonCountdown } from "./SeasonCountdown";
import { formatTokenAmount, isPlantingOpen } from "@/lib/harvest/utils";
import type { SeasonConfig } from "@/lib/harvest/types";

export function HarvestHero({ season }: { season: SeasonConfig }) {
  const plantingOpen = isPlantingOpen(season.status, new Date(season.plantingEnd).getTime() / 1000);

  function scrollToPlant() {
    document.getElementById("plant")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToShare() {
    document.getElementById("share")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      className="relative overflow-hidden rounded-b-xl3 bg-field bg-cover bg-center px-4 pb-8 pt-8 sm:px-8 sm:pt-10 sm:pb-10"
      style={{ backgroundImage: "url(/brand/meadow.jpg)" }}
    >
      {/* Dark-green wash keeps the meadow on-brand while the text stays readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-field via-field/85 to-field/20"
      />
      <div className="relative">
      <h1 className="m-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/harvest-logo.png"
          alt="Harvest"
          width={900}
          height={291}
          className="h-auto w-full max-w-[22rem] drop-shadow-xl sm:max-w-[36rem]"
        />
      </h1>
      <p className="mt-4 max-w-lg text-base text-cream/90 sm:text-lg">
        {plantingOpen
          ? "Plant $TOUCHGRASS. Grow together. Harvest together."
          : "Planting is closed. Grow together. Harvest together."}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-grass-light/25 px-3 py-1 text-xs font-semibold text-grass-light">{plantingOpen ? "🌱 Active Season" : "🌱 Growing · Planting closed"}</span>
        <span className="font-display text-lg font-bold text-cream">{season.seasonName}</span>
      </div>
      <p className="mt-2 max-w-md text-sm text-cream/70">{season.description}</p>

      <div className="mt-6" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sun">Total locked in Harvest</p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-display text-3xl font-bold text-cream min-[380px]:text-4xl sm:text-5xl">
          <span className="max-w-full break-words">{formatTokenAmount(season.totalLocked)}</span>
          <span className="text-lg font-bold text-cream/70 sm:text-xl">$TOUCHGRASS</span>
        </p>
        <p className="mt-1 text-xs text-cream/60">
          {formatTokenAmount(season.lockedParticipantCount)} planter
          {season.lockedParticipantCount === 1 ? "" : "s"} · live on-chain
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SeasonCountdown />
        {plantingOpen ? (
          <Button variant="primary" size="lg" onClick={scrollToPlant} className="w-full sm:w-auto">
            🌾 Plant $TOUCHGRASS
          </Button>
        ) : (
          <Button variant="primary" size="lg" onClick={scrollToShare} className="w-full sm:w-auto">
            📣 Share Harvest
          </Button>
        )}
      </div>
      </div>
    </section>
  );
}
