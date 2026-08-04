"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatTokenAmount } from "@/lib/harvest/utils";

function formatUnixDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PlantConfirmationModal({
  open,
  onClose,
  onConfirm,
  submitting,
  seasonDescription,
  amount,
  walletAddress,
  harvestDate,
  plantingEnd,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
  seasonDescription: string;
  amount: number;
  walletAddress: string | null;
  harvestDate: number;
  plantingEnd: number;
}) {
  return (
    <Modal open={open} onClose={onClose} titleId="plant-confirm-title">
      <p className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-sun/20 px-3 py-1 text-xs font-semibold text-harvest-dark">
        Real transaction — mainnet
      </p>
      <h2 id="plant-confirm-title" className="mt-2 font-display text-xl font-bold text-ink">
        Confirm Plant
      </h2>
      <p className="mt-1 text-xs text-ink-soft">
        If you&apos;ve already planted this season, this amount will be added to your existing position.
      </p>

      <dl className="mt-4 space-y-2 text-sm">
        <Row label="Season" value={seasonDescription} />
        <Row label="Wallet" value={walletAddress ?? "—"} />
        <Row label="Amount" value={`${formatTokenAmount(amount)} $TOUCHGRASS`} />
        <Row label="Planting ends" value={formatUnixDate(plantingEnd)} />
        <Row label="Harvest date" value={formatUnixDate(harvestDate)} />
      </dl>

      <div className="mt-4 space-y-1.5 rounded-xl2 bg-cream-dark p-3 text-xs text-ink-soft">
        <p>Your principal remains locked until Harvest Day.</p>
        <p>Seasonal rewards are distributed separately from your principal.</p>
        <p>Your wallet will ask you to approve this transaction.</p>
      </div>

      <div className="mt-6 flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="primary" className="flex-1" onClick={onConfirm} disabled={submitting}>
          {submitting ? "Confirming..." : "Confirm & Sign"}
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
