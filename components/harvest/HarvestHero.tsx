"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SeasonCountdown } from "./SeasonCountdown";
import type { SeasonConfig } from "@/lib/harvest/types";

export function HarvestHero({ season }: { season: SeasonConfig }) {
  function scrollToPlant() {
    document.getElementById("plant")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="rounded-b-xl3 bg-field px-4 pb-8 pt-8 sm:px-8 sm:pt-10 sm:pb-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sun">Touch Grass</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight text-cream sm:text-5xl">
        Harvest
      </h1>
      <p className="mt-3 max-w-lg text-base text-cream/80 sm:text-lg">
        Plant $TOUCHGRASS. Grow together. Harvest together.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Badge tone="grass">🌱 Active Season</Badge>
        <span className="font-display text-lg font-bold text-cream">{season.seasonName}</span>
      </div>
      <p className="mt-2 max-w-md text-sm text-cream/70">{season.description}</p>

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SeasonCountdown targetIso={season.harvestDate} />
        <Button variant="primary" size="lg" onClick={scrollToPlant} className="w-full sm:w-auto">
          🌾 Plant $TOUCHGRASS
        </Button>
      </div>
    </section>
  );
}
