"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { getCountdown, formatDate, formatTokenAmount } from "@/lib/harvest/utils";
import type { PlantPosition, SeasonConfig } from "@/lib/harvest/types";
import { useWalletState } from "@/lib/wallet/useWalletState";

const STATUS_LABEL: Record<PlantPosition["status"], string> = {
  none: "No position",
  "preview-created": "Preview created",
  locked: "Locked",
  "ready-to-harvest": "Ready to harvest",
  claimed: "Claimed",
};

function GrowthRing({ progress }: { progress: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden="true">
      <circle cx="44" cy="44" r={radius} fill="none" stroke="#E9E2C6" strokeWidth="8" />
      <circle
        cx="44"
        cy="44"
        r={radius}
        fill="none"
        stroke="#3E9142"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 44 44)"
        className="transition-[stroke-dashoffset] duration-500 motion-reduce:transition-none"
      />
      <text x="44" y="49" textAnchor="middle" fontSize="20">
        🌱
      </text>
    </svg>
  );
}

export function PositionCard({
  season,
  position,
  onClaim,
}: {
  season: SeasonConfig;
  position: PlantPosition;
  onClaim: () => void;
}) {
  const wallet = useWalletState();
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  // `now` is only ever set inside an effect — never read directly from
  // Date.now() during render — so server and client markup always agree
  // on the first paint.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const canClaim = season.harvestReady && position.status === "ready-to-harvest";

  if (position.status === "none") {
    return (
      <Card id="position">
        <h2 className="font-display text-lg font-bold text-ink">My Position</h2>
        <p className="mt-3 text-sm text-ink-soft">
          You haven&apos;t planted this season yet. Use the Plant widget to preview a position.
        </p>
      </Card>
    );
  }

  const plantingEndMs = new Date(season.plantingEnd).getTime();
  const harvestMs = new Date(season.harvestDate).getTime();
  const progress =
    now === null
      ? 0
      : Math.min(1, Math.max(0, (now - plantingEndMs) / Math.max(1, harvestMs - plantingEndMs)));
  const countdown = getCountdown(season.harvestDate);

  return (
    <Card id="position">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">My Position</h2>
          <p className="mt-1 text-xs text-ink-soft">
            {wallet.shortAddress ?? "Wallet not connected"} · {season.seasonName}
          </p>
        </div>
        <GrowthRing progress={progress} />
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-ink-soft">Planted amount</dt>
          <dd className="font-display font-bold text-ink">
            {formatTokenAmount(position.amount)} $TOUCHGRASS
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-ink-soft">Status</dt>
          <dd>
            <Badge tone={position.status === "claimed" ? "neutral" : "grass"}>
              {STATUS_LABEL[position.status]}
            </Badge>
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-ink-soft">Harvest date</dt>
          <dd className="font-semibold text-ink">{formatDate(season.harvestDate)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-ink-soft">Time remaining</dt>
          <dd className="font-semibold text-ink">
            {countdown.isPast ? "Harvest Day reached" : `${countdown.days}d ${countdown.hours}h`}
          </dd>
        </div>
      </dl>

      <Button
        variant="primary"
        size="lg"
        className="mt-5 w-full"
        disabled={!canClaim}
        onClick={() => setClaimModalOpen(true)}
      >
        🧺 Claim Principal
      </Button>
      {!canClaim && (
        <p className="mt-1 text-center text-xs text-ink-soft">Available on Harvest Day</p>
      )}

      <Modal
        open={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        titleId="claim-preview-title"
      >
        <p className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-sun/20 px-3 py-1 text-xs font-semibold text-harvest-dark">
          Preview only — no tokens will move
        </p>
        <h2 id="claim-preview-title" className="mt-2 font-display text-xl font-bold text-ink">
          Claim Principal preview
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          This preview would return {formatTokenAmount(position.amount)} $TOUCHGRASS principal to
          your wallet. Claiming isn&apos;t connected to the blockchain yet.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setClaimModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => {
              onClaim();
              setClaimModalOpen(false);
            }}
          >
            Confirm Preview
          </Button>
        </div>
      </Modal>
    </Card>
  );
}
