export type SeasonStatus = "upcoming" | "planting" | "growing" | "harvest-ready" | "closed";

export interface SeasonConfig {
  seasonId: string;
  seasonName: string;
  status: SeasonStatus;
  description: string;
  /** ISO timestamps — countdown and "time remaining" are derived from these, never hardcoded. */
  plantingStart: string;
  plantingEnd: string;
  harvestDate: string;
  minimumDeposit: number;
  depositIncrement: number;
  /** Preview-only figures for Phase 1. Never presented as real financial data. */
  totalPlanted: number;
  participantCount: number;
  receiptEnabled: boolean;
  /** Explicit gate for Claim Principal — separate from `status` per the brief's data structure. */
  harvestReady: boolean;
}

export type PositionStatus =
  | "none"
  | "preview-created"
  | "locked"
  | "ready-to-harvest"
  | "claimed";

export interface PlantPosition {
  status: PositionStatus;
  amount: number;
  seasonId: string;
  receiptId: string | null;
}
