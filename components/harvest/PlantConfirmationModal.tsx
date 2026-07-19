"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatDate, formatTokenAmount } from "@/lib/harvest/utils";
import type { SeasonConfig } from "@/lib/harvest/types";

export function PlantConfirmationModal({
  open,
  onClose,
  onConfirm,
  season,
  amount,
  walletAddress,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  season: SeasonConfig;
  amount: number;
  walletAddress: string | null;
}) {
  return (
    <Modal open={open} onClose={onClose} titleId="plant-confirm-title">
      <p className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-sun/20 px-3 py-1 text-xs font-semibold text-harvest-dark">
        Preview only — no tokens will move
      </p>
      <h2 id="plant-confirm-title" className="mt-2 font-display text-xl font-bold text-ink">
        Confirm Plant preview
      </h2>

      <dl className="mt-4 space-y-2 text-sm">
        <Row label="Season" value={season.seasonName} />
        <Row label="Wallet" value={walletAddress ?? "—"} />
        <Row label="Amount" value={`${formatTokenAmount(amount)} $TOUCHGRASS`} />
        <Row
          label="Planting window"
          value={`${formatDate(season.plantingStart)} – ${formatDate(season.plantingEnd)}`}
        />
        <Row label="Harvest date" value={formatDate(season.harvestDate)} />
      </dl>

      <div className="mt-4 space-y-1.5 rounded-xl2 bg-cream-dark p-3 text-xs text-ink-soft">
        <p>Your principal remains locked until Harvest Day.</p>
        <p>Seasonal rewards are distributed separately from your principal.</p>
      </div>

      <div className="mt-6 flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" className="flex-1" onClick={onConfirm}>
          Confirm Preview
        </Button>
      </div>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}
