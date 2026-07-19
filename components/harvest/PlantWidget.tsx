"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlantConfirmationModal } from "./PlantConfirmationModal";
import { useWalletState } from "@/lib/wallet/useWalletState";
import { formatTokenAmount } from "@/lib/harvest/utils";
import { QUICK_SELECT_AMOUNTS } from "@/lib/harvest/mockData";
import type { SeasonConfig } from "@/lib/harvest/types";

export function PlantWidget({
  season,
  onPlantConfirmed,
}: {
  season: SeasonConfig;
  onPlantConfirmed: (amount: number) => void;
}) {
  const { minimumDeposit, depositIncrement } = season;
  const [amount, setAmount] = useState<number>(minimumDeposit);
  const [modalOpen, setModalOpen] = useState(false);
  const wallet = useWalletState();

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
    setModalOpen(true);
  }

  function handleConfirmPreview() {
    onPlantConfirmed(amount);
    setModalOpen(false);
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
            ? "🌾 Plant $TOUCHGRASS"
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
        season={season}
        amount={amount}
        walletAddress={wallet.shortAddress}
      />
    </Card>
  );
}
