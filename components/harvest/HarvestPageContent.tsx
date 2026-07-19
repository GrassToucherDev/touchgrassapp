"use client";

import { useState } from "react";
import { HarvestHero } from "./HarvestHero";
import { SeasonStats } from "./SeasonStats";
import { HarvestSteps } from "./HarvestSteps";
import { PlantWidget } from "./PlantWidget";
import { PositionCard } from "./PositionCard";
import { HarvestReceiptPreview } from "./HarvestReceiptPreview";
import { HarvestNotice } from "./HarvestNotice";
import { MOCK_SEASON } from "@/lib/harvest/mockData";
import type { PlantPosition, SeasonConfig } from "@/lib/harvest/types";

function nextReceiptId(seasonId: string): string {
  const num = Math.floor(Math.random() * 90_000 + 10_000);
  return `${seasonId.toUpperCase()}-${num}`;
}

function derivePositionStatus(season: SeasonConfig): PlantPosition["status"] {
  if (season.harvestReady) return "ready-to-harvest";
  if (season.status === "planting") return "preview-created";
  if (season.status === "closed") return "claimed";
  return "locked";
}

export function HarvestPageContent() {
  const season = MOCK_SEASON;
  const [position, setPosition] = useState<PlantPosition>({
    status: "none",
    amount: 0,
    seasonId: season.seasonId,
    receiptId: null,
  });

  function handlePlantConfirmed(amount: number) {
    setPosition({
      status: derivePositionStatus(season),
      amount,
      seasonId: season.seasonId,
      receiptId: season.receiptEnabled ? nextReceiptId(season.seasonId) : null,
    });
  }

  function handleClaim() {
    setPosition((prev) => ({ ...prev, status: "claimed" }));
  }

  return (
    <div id="top">
      <HarvestHero season={season} />

      <div className="space-y-8 px-4 pt-6 sm:px-8">
        <SeasonStats season={season} />
        <HarvestSteps />

        <div className="grid gap-6 lg:grid-cols-2">
          <PlantWidget season={season} onPlantConfirmed={handlePlantConfirmed} />
          <PositionCard season={season} position={position} onClaim={handleClaim} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <HarvestReceiptPreview season={season} position={position} />
        </div>

        <HarvestNotice />
      </div>
    </div>
  );
}
