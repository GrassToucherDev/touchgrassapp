"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlantConfirmationModal } from "./PlantConfirmationModal";
import { useWalletState } from "@/lib/wallet/useWalletState";
import { formatTokenAmount } from "@/lib/harvest/utils";
import { QUICK_SELECT_AMOUNTS } from "@/lib/harvest/mockData";
import {
  getProgram,
  seasonConfigPda,
  plantPositionPda,
  escrowAuthorityPda,
  escrowTokenPda,
} from "@/lib/harvest/program";
import type { OnChainSeasonConfig } from "@/lib/harvest/useSeasonData";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useMyPosition } from "@/lib/harvest/useMyPosition";

export function PlantWidget({
  season,
  onPlantConfirmed,
}: {
  season: OnChainSeasonConfig;
  onPlantConfirmed: () => void;
}) {
  const { minimumDeposit, depositIncrement } = season;
  const [amount, setAmount] = useState<number>(minimumDeposit);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const wallet = useWalletState();
  const { position: existingPosition, refetch: refetchPosition } = useMyPosition(season.seasonId);

  function increase() {
    setAmount((prev) => prev + depositIncrement);
  }

  function decrease() {
    setAmount((prev) => Math.max(minimumDeposit, prev - depositIncrement));
  }

  function selectQuickAmount(value: number) {
    setAmount(value);
  }

  function handlePrimaryAction() {
    if (!wallet.connected) {
      void wallet.connect();
      return;
    }
    setSubmitError(null);
    setModalOpen(true);
  }

  async function handleConfirmPreview() {
    if (!wallet.anchorWallet) {
      setSubmitError("Wallet not properly connected.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const program = getProgram(wallet.anchorWallet);
      if (!program) throw new Error("Could not build program client.");

      const planter = wallet.anchorWallet.publicKey;
      const mint = new PublicKey(season.mint);
      const [seasonPda] = seasonConfigPda(season.seasonId);
      const [positionPda] = plantPositionPda(season.seasonId, planter);
      const [escrowAuthPda] = escrowAuthorityPda(season.seasonId, planter);
      const [escrowTokenAcct] = escrowTokenPda(season.seasonId, planter);

      const planterAta = getAssociatedTokenAddressSync(mint, planter);

      // Create the planter's token account if it doesn't exist yet —
      // first-time planters won't have one.
      const connection = program.provider.connection;
      const ataInfo = await connection.getAccountInfo(planterAta);
      const preInstructions = [];
      if (!ataInfo) {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            planter,
            planterAta,
            planter,
            mint
          )
        );
      }

      const sig = await program.methods
        .plant(new anchor.BN(season.seasonId), new anchor.BN(amount))
        .accounts({
          planter,
          seasonConfig: seasonPda,
          plantPosition: positionPda,
          escrowAuthority: escrowAuthPda,
          escrowTokenAccount: escrowTokenAcct,
          planterTokenAccount: planterAta,
          mint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .preInstructions(preInstructions)
        .rpc();

      console.log("✅ plant tx:", sig);
      void refetchPosition();
      onPlantConfirmed();
      setModalOpen(false);
    } catch (e: any) {
      console.error("Plant failed:", e);
      setSubmitError(e.message?.slice(0, 200) ?? "Transaction failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card id="plant" className="scroll-mt-4">
      <h2 className="font-display text-lg font-bold text-ink">🌱 Plant $TOUCHGRASS</h2>
      <p className="mt-1 text-xs text-ink-soft">
        Choose an amount in {formatTokenAmount(depositIncrement)}-token increments.
      </p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Quick select amount">
        {QUICK_SELECT_AMOUNTS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => selectQuickAmount(value)}
            aria-pressed={amount === value}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grass-dark
              ${
                amount === value
                  ? "bg-grass text-white"
                  : "bg-cream text-ink-soft hover:bg-cream-dark"
              }`}
          >
            {value >= 1_000_000 ? `${value / 1_000_000}M` : `${value / 1000}K`}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl2 bg-cream px-3 py-3 sm:px-4">
        <button
          type="button"
          onClick={decrease}
          disabled={amount <= minimumDeposit}
          aria-label={`Decrease amount by ${formatTokenAmount(depositIncrement)}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl font-bold text-ink shadow-softer disabled:opacity-30
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grass-dark"
        >
          −
        </button>

        <div className="flex flex-col items-center">
          <span className="font-display text-2xl font-extrabold tabular-nums text-ink sm:text-3xl">
            {formatTokenAmount(amount)}
          </span>
          <span className="text-xs font-semibold text-ink-soft">$TOUCHGRASS</span>
        </div>

        <button
          type="button"
          onClick={increase}
          aria-label={`Increase amount by ${formatTokenAmount(depositIncrement)}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl font-bold text-ink shadow-softer
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grass-dark"
        >
          +
        </button>
      </div>
      <p className="mt-1 text-center text-xs text-ink-soft">
        Minimum {formatTokenAmount(minimumDeposit)} $TOUCHGRASS
      </p>

      <div className="mt-2 text-xs text-ink-soft">
        {wallet.connected ? (
          <span>
            Connected: <span className="font-semibold text-ink">{wallet.shortAddress}</span>
          </span>
        ) : (
          <span>Connect your wallet to plant.</span>
        )}
      </div>

      {submitError && (
        <p className="mt-2 rounded-xl2 bg-harvest/10 px-3 py-2 text-xs font-medium text-harvest-dark">
          {submitError}
        </p>
      )}

      {wallet.connected && existingPosition && (
        <div className="mt-4 rounded-xl2 bg-grass/10 px-4 py-3 text-center text-sm font-semibold text-grass-dark">
          ✅ You&apos;ve planted {existingPosition.amount.toLocaleString()} $TOUCHGRASS this season so far.
        </div>
      )}

      <Button
        variant={wallet.connected ? "primary" : "secondary"}
        size="lg"
        className="mt-4 w-full"
        onClick={handlePrimaryAction}
        disabled={wallet.connecting}
      >
        {wallet.connecting
          ? "Connecting..."
          : wallet.connected
            ? existingPosition
              ? "🌾 Plant More $TOUCHGRASS"
              : "🌾 Plant $TOUCHGRASS"
            : "Connect Wallet"}
      </Button>
      {!wallet.connected && (
        <p className="mt-1 text-center text-xs text-ink-soft">
          You&apos;ll be able to confirm in your wallet.
        </p>
      )}

      <PlantConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmPreview}
        submitting={submitting}
        seasonDescription={season.description}
        amount={amount}
        walletAddress={wallet.shortAddress}
        harvestDate={season.harvestDate}
        plantingEnd={season.plantingEnd}
      />
    </Card>
  );
}
