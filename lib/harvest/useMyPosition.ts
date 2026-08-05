"use client";

import { useEffect, useState, useCallback } from "react";
import { getProgram, plantPositionPda } from "./program";
import { useWalletState } from "@/lib/wallet/useWalletState";
import { getMint } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

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

export function useMyPosition(seasonId: number, mintAddress?: string) {
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

      let decimals = 6; // fallback only used if mintAddress isn't provided
      if (mintAddress) {
        const mintInfo = await getMint(program.provider.connection, new PublicKey(mintAddress));
        decimals = mintInfo.decimals;
      }
      const divisor = 10 ** decimals;

      setPosition({
        seasonId: account.seasonId.toNumber(),
        owner: account.owner.toBase58(),
        amount: account.amount.toNumber() / divisor,
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
  }, [anchorWallet, seasonId, mintAddress]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { position, loading, refetch };
}