"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { getCountdown, formatDate, formatTokenAmount } from "@/lib/harvest/utils";
import type { PlantPosition, SeasonConfig } from "@/lib/harvest/types";
import { useWalletState } from "@/lib/wallet/useWalletState";
import { getProgram, seasonConfigPda, plantPositionPda, escrowAuthorityPda, escrowTokenPda } from "@/lib/harvest/program";
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

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
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const canClaim = season.harvestReady && position.status === "locked";

  if (position.status === "none") {
    return (
      <Card id="position">
        <h2 className="font-display text-lg font-bold text-ink">My Position</h2>
        <p className="mt-3 text-sm text-ink-soft">
          You haven&apos;t planted this season yet. Use the Plant widget to get started.
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

  async function handleConfirmClaim() {
    if (!wallet.anchorWallet) {
      setClaimError("Wallet not properly connected.");
      return;
    }

    setClaiming(true);
    setClaimError(null);

    try {
      const program = getProgram(wallet.anchorWallet);
      if (!program) throw new Error("Could not build program client.");

      const seasonIdNum = Number(season.seasonId.replace("season-", ""));
      const planter = wallet.anchorWallet.publicKey;
      const mint = new PublicKey(season.mint);
      const [seasonPda] = seasonConfigPda(seasonIdNum);
      const [positionPda] = plantPositionPda(seasonIdNum, planter);
      const [escrowAuthPda] = escrowAuthorityPda(seasonIdNum, planter);
      const [escrowTokenAcct] = escrowTokenPda(seasonIdNum, planter);
      const planterAta = getAssociatedTokenAddressSync(mint, planter);

      const sig = await program.methods
        .claimPrincipal(new anchor.BN(seasonIdNum))
        .accounts({
          planter,
          seasonConfig: seasonPda,
          plantPosition: positionPda,
          escrowAuthority: escrowAuthPda,
          escrowTokenAccount: escrowTokenAcct,
          planterTokenAccount: planterAta,
          mint,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      console.log("✅ claim_principal tx:", sig);
      onClaim();
      setClaimModalOpen(false);
    } catch (e: any) {
      console.error("Claim failed:", e);
      setClaimError(e.message?.slice(0, 200) ?? "Transaction failed.");
    } finally {
      setClaiming(false);
    }
  }

  function flexToX() {
    const text = `🌱 Just planted ${formatTokenAmount(position.amount)} $TOUCHGRASS in ${season.seasonName}.\n\nLocked until Harvest Day: ${formatDate(season.harvestDate)}.\n\n$TOUCHGRASS #TouchGrass #TheHarvest\napp.touchgrass.today/harvest`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  }

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

      {claimError && (
        <p className="mt-3 rounded-xl2 bg-harvest/10 px-3 py-2 text-xs font-medium text-harvest-dark">
          {claimError}
        </p>
      )}

      <Button
        variant="primary"
        size="lg"
        className="mt-5 w-full"
        disabled={!canClaim}
        onClick={() => setClaimModalOpen(true)}
      >
        🧺 Claim Principal
      </Button>
      {!canClaim && position.status !== "claimed" && (
        <p className="mt-1 text-center text-xs text-ink-soft">Available on Harvest Day</p>
      )}

      <Button
        variant="ghost"
        size="lg"
        className="mt-3 flex w-full items-center justify-center gap-2"
        onClick={flexToX}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Flex to X
      </Button>

      <Modal
        open={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        titleId="claim-preview-title"
      >
        <p className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-sun/20 px-3 py-1 text-xs font-semibold text-harvest-dark">
          Real transaction — mainnet
        </p>
        <h2 id="claim-preview-title" className="mt-2 font-display text-xl font-bold text-ink">
          Confirm Claim
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          This will return {formatTokenAmount(position.amount)} $TOUCHGRASS principal to your
          wallet. Your wallet will ask you to approve this transaction.
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => setClaimModalOpen(false)}
            disabled={claiming}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleConfirmClaim}
            disabled={claiming}
          >
            {claiming ? "Confirming..." : "Confirm & Sign"}
          </Button>
        </div>
      </Modal>
    </Card>
  );
}