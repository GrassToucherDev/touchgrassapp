"use client";

import { useEffect, useState, useCallback } from "react";
import { getProgram, plantPositionPda } from "./program";
import { useWalletState } from "@/lib/wallet/useWalletState";

export interface OnChainPosition {
  seasonId: number;
  owner: string;
  amount: number;
  plantedAt: number;
  status: string; // "planted" | "claimed"
  escrow: string;
}

function parseStatus(statusEnum: any): string {
  return Object.keys(statusEnum)[0];
}

export function useMyPosition(seasonId: number) {
  const { anchorWallet } = useWalletState();
  const [position, setPosition] = useState<OnChainPosition | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const program = getProgram(anchorWallet);
    if (!program || !anchorWallet) {
      setPosition(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [pda] = plantPositionPda(seasonId, anchorWallet.publicKey);
      const account: any = await (program.account as any).plantPosition.fetch(pda);

      setPosition({
        seasonId: account.seasonId.toNumber(),
        owner: account.owner.toBase58(),
        amount: account.amount.toNumber(),
        plantedAt: account.plantedAt.toNumber(),
        status: parseStatus(account.status),
        escrow: account.escrow.toBase58(),
      });
    } catch (e) {
      // Account not found means no position yet for this season — not an error.
      setPosition(null);
    } finally {
      setLoading(false);
    }
  }, [anchorWallet, seasonId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { position, loading, refetch };
}
