"use client";

import { HarvestHero } from "./HarvestHero";
import { SeasonStats } from "./SeasonStats";
import { HarvestSteps } from "./HarvestSteps";
import { PlantWidget } from "./PlantWidget";
import { PositionCard } from "./PositionCard";
import { HarvestReceiptPreview } from "./HarvestReceiptPreview";
import { HarvestNotice } from "./HarvestNotice";
import { ShareHarvest } from "./ShareHarvest";
import { useSeasonData, type OnChainSeasonConfig } from "@/lib/harvest/useSeasonData";
import { useMyPosition } from "@/lib/harvest/useMyPosition";
import { isPlantingOpen } from "@/lib/harvest/utils";
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
    totalLocked: onChain.totalLocked,
    lockedParticipantCount: onChain.lockedParticipantCount,
    participantCount: onChain.participantCount,
    receiptEnabled: true,
    harvestReady: onChain.status === "harvestReady",
  };
}

export function HarvestPageContent() {
  const { season: onChainSeason, loading, error, refetch: refetchSeason } = useSeasonData(ACTIVE_SEASON_ID);
  const {
    position: onChainPosition,
    loading: positionLoading,
    refetch: refetchPosition,
 } = useMyPosition(ACTIVE_SEASON_ID, onChainSeason?.mint);

  if (loading) {
    return (
      <div id="top" className="flex min-h-[50vh] items-center justify-center">
        <p className="text-ink-soft">
          Loading season...
        </p>
      </div>
    );
  }

  if (error || !onChainSeason) {
    return (
      <div id="top" className="flex min-h-[50vh] flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-ink-soft">Couldn&apos;t load live Harvest data right now.</p>
        {error && <p className="text-xs text-harvest-dark">{error}</p>}
        <button
          type="button"
          onClick={() => void refetchSeason()}
          className="mt-2 rounded-full border border-ink-soft/30 px-4 py-2 text-sm font-semibold text-ink"
        >
          Try again
        </button>
      </div>
    );
  }

  const displaySeason = toDisplaySeason(onChainSeason);
  const plantingOpen = isPlantingOpen(displaySeason.status, onChainSeason.plantingEnd);

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
    void refetchSeason();
  }

  function handleClaim() {
    void refetchPosition();
    void refetchSeason();
  }

  return (
    <div id="top">
      <HarvestHero season={displaySeason} />

      <div className="space-y-8 px-4 pt-6 sm:px-8">
        <SeasonStats season={displaySeason} />
        <ShareHarvest plantedAmount={displayPosition.status === "locked" ? displayPosition.amount : 0} />
        <HarvestSteps plantingOpen={plantingOpen} />

        <div className={plantingOpen ? "grid gap-6 lg:grid-cols-2" : "grid gap-6"}>
          {plantingOpen && <PlantWidget season={onChainSeason} onPlantConfirmed={handlePlantConfirmed} />}
          {positionLoading ? (
            <div className="flex items-center justify-center rounded-xl3 bg-white p-6 shadow-soft">
              <p className="text-sm text-ink-soft">Loading your position...</p>
            </div>
          ) : (
            <PositionCard season={displaySeason} position={displayPosition} onClaim={handleClaim} plantingOpen={plantingOpen} />
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <HarvestReceiptPreview season={displaySeason} position={displayPosition} plantingOpen={plantingOpen} />
        </div>

        <HarvestNotice />
      </div>
    </div>
  );
}
