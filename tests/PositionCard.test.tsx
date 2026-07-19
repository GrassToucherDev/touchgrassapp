import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PositionCard } from "@/components/harvest/PositionCard";
import { MOCK_SEASON } from "@/lib/harvest/mockData";
import type { PlantPosition } from "@/lib/harvest/types";
import { resetWalletMock } from "./mocks/walletState";

afterEach(() => {
  resetWalletMock();
});

describe("PositionCard — Claim Principal gating", () => {
  it("is disabled while the season is not harvest-ready", () => {
    const position: PlantPosition = {
      status: "locked",
      amount: 100_000,
      seasonId: MOCK_SEASON.seasonId,
      receiptId: "SEASON-1-12345",
    };
    render(<PositionCard season={MOCK_SEASON} position={position} onClaim={vi.fn()} />);

    expect(screen.getByRole("button", { name: /claim principal/i })).toBeDisabled();
  });

  it("is enabled once the mock season is configured harvestReady and the position is ready", () => {
    const readySeason = { ...MOCK_SEASON, status: "harvest-ready" as const, harvestReady: true };
    const position: PlantPosition = {
      status: "ready-to-harvest",
      amount: 100_000,
      seasonId: readySeason.seasonId,
      receiptId: "SEASON-1-12345",
    };
    render(<PositionCard season={readySeason} position={position} onClaim={vi.fn()} />);

    expect(screen.getByRole("button", { name: /claim principal/i })).toBeEnabled();
  });

  it("shows the no-position empty state when there is nothing planted", () => {
    const position: PlantPosition = {
      status: "none",
      amount: 0,
      seasonId: MOCK_SEASON.seasonId,
      receiptId: null,
    };
    render(<PositionCard season={MOCK_SEASON} position={position} onClaim={vi.fn()} />);

    expect(screen.getByText(/haven't planted this season yet/i)).toBeInTheDocument();
  });
});
