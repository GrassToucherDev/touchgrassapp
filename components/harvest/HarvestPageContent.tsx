"use client";

import { HarvestHero } from "./HarvestHero";
import { SeasonStats } from "./SeasonStats";
import { HarvestSteps } from "./HarvestSteps";
import { PlantWidget } from "./PlantWidget";
import { PositionCard } from "./PositionCard";
import { HarvestReceiptPreview } from "./HarvestReceiptPreview";
import { HarvestNotice } from "./HarvestNotice";
import { useSeasonData, type OnChainSeasonConfig } from "@/lib/harvest/useSeasonData";
import { useMyPosition } from "@/lib/harvest/useMyPosition";
import type { SeasonConfig, SeasonStatus } from "@/lib/harvest/types";

const ACTIVE_SEASON_ID = 1;

function mapStatus(onChainStatus: string): SeasonStatus {
  const map: Record<string, SeasonStatus> = {
    upcoming: "upcoming",
    planting: "planting",
    growing: "growing",
    harvestReady: "harvest-ready",
    closed: "closed",
  };
  return map[onChainStatus] ?? "upcoming";
}

function toDisplaySeason(onChain: OnChainSeasonConfig): SeasonConfig {
  return {
    seasonId: `season-${onChain.seasonId}`,
    seasonName: `Season ${onChain.seasonId}`,
    mint: onChain.mint,
    status: mapStatus(onChain.status),
    description: onChain.description,
    plantingStart: new Date(onChain.plantingStart * 1000).toISOString(),
    plantingEnd: new Date(onChain.plantingEnd * 1000).toISOString(),
    harvestDate: new Date(onChain.harvestDate * 1000).toISOString(),
    minimumDeposit: onChain.minimumDeposit,
    depositIncrement: onChain.depositIncrement,
    totalPlanted: onChain.totalPlanted,
    participantCount: onChain.participantCount,
    receiptEnabled: true,
    harvestReady: onChain.status === "harvestReady",
  };
}

export function HarvestPageContent() {
  const { season: onChainSeason, loading, error } = useSeasonData(ACTIVE_SEASON_ID);
  const {
    position: onChainPosition,
    loading: positionLoading,
    refetch: refetchPosition,
 } = useMyPosition(ACTIVE_SEASON_ID, onChainSeason?.mint);

  if (loading) {
    return (
      <div id="top" className="flex min-h-[50vh] items-center justify-center">
        <p className="text-ink-soft">
          {onChainSeason === null ? "Connect your wallet to load season data..." : "Loading season..."}
        </p>
      </div>
    );
  }

  if (error || !onChainSeason) {
    return (
      <div id="top" className="flex min-h-[50vh] flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-ink-soft">
          Connect your wallet to view live Harvest data.
        </p>
        {error && <p className="text-xs text-harvest-dark">{error}</p>}
      </div>
    );
  }

  const displaySeason = toDisplaySeason(onChainSeason);

  // Adapt the real on-chain position into the shape PositionCard/
  // HarvestReceiptPreview already expect. This is the single source of
  // truth now — no more locally-tracked "amount from the last plant
  // transaction" going stale after a top-up.
  const displayPosition = onChainPosition
    ? {
        status: onChainPosition.status === "claimed" ? ("claimed" as const) : ("locked" as const),
        amount: onChainPosition.amount,
        seasonId: `season-${ACTIVE_SEASON_ID}`,
        receiptId: `SEASON-${ACTIVE_SEASON_ID}-${onChainPosition.owner.slice(0, 6)}`,
      }
    : {
        status: "none" as const,
        amount: 0,
        seasonId: `season-${ACTIVE_SEASON_ID}`,
        receiptId: null,
      };

  function handlePlantConfirmed() {
    void refetchPosition();
  }

  function handleClaim() {
    void refetchPosition();
  }

  return (
    <div id="top">
      <HarvestHero season={displaySeason} />

      <div className="space-y-8 px-4 pt-6 sm:px-8">
        <SeasonStats season={displaySeason} />
        <HarvestSteps />

        <div className="grid gap-6 lg:grid-cols-2">
          <PlantWidget season={onChainSeason} onPlantConfirmed={handlePlantConfirmed} />
          {positionLoading ? (
            <div className="flex items-center justify-center rounded-xl3 bg-white p-6 shadow-soft">
              <p className="text-sm text-ink-soft">Loading your position...</p>
            </div>
          ) : (
            <PositionCard season={displaySeason} position={displayPosition} onClaim={handleClaim} />
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <HarvestReceiptPreview season={displaySeason} position={displayPosition} />
        </div>

        <HarvestNotice />
      </div>
    </div>
  );
}
