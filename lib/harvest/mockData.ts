import type { SeasonConfig } from "./types";

/**
 * Phase 1 mock season configuration — the single source of truth for
 * Harvest's preview data. Every number here is a sample value, not a real
 * on-chain total. Phase 2 replaces this with a fetch from the program's
 * season account using the same shape (see README.md).
 */
export const MOCK_SEASON: SeasonConfig = {
  seasonId: "season-1",
  seasonName: "Season 1",
  status: "growing",
  description: "The first season of collective growth and rewards.",
  plantingStart: "2026-07-01T00:00:00Z",
  plantingEnd: "2026-07-31T23:59:59Z",
  harvestDate: "2026-08-10T12:00:00Z",
  minimumDeposit: 50_000,
  depositIncrement: 50_000,
  totalPlanted: 12_543_210,
  participantCount: 3_248,
  receiptEnabled: true,
  harvestReady: false,
};

export const QUICK_SELECT_AMOUNTS = [50_000, 100_000, 250_000, 500_000, 1_000_000];
