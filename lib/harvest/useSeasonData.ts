"use client";

import { useEffect, useState, useCallback } from "react";
import { getProgram, seasonConfigPda } from "./program";
import { useWalletState } from "@/lib/wallet/useWalletState";
import { getMint } from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";

// Mirrors the on-chain SeasonConfig account shape. Field names are
// camelCase because that's what Anchor's IDL-driven client produces from
// the Rust snake_case fields.
export interface OnChainSeasonConfig {
  seasonId: number;
  authority: string;
  mint: string;
  status: string; // e.g. "planting", "harvestReady" — derived from the enum variant name
  description: string;
  plantingStart: number;
  plantingEnd: number;
  harvestDate: number;
  minimumDeposit: number;
  depositIncrement: number;
  rewardPoolAmount: number;
  receiptMetadataUri: string;
  totalPlanted: number;
  participantCount: number;
}

function parseStatus(statusEnum: any): string {
  // Anchor represents Rust enums like { planting: {} } — the key is the variant name.
  return Object.keys(statusEnum)[0];
}

export function useSeasonData(seasonId: number) {
  const { anchorWallet } = useWalletState();
  const [season, setSeason] = useState<OnChainSeasonConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    const program = getProgram(anchorWallet);
    if (!program) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [pda] = seasonConfigPda(seasonId);
      const account: any = await (program.account as any).seasonConfig.fetch(pda);

      // PlantPosition accounts aren't summed on-chain, so total planted and
      // participant count are derived here by fetching every position for
      // this season and aggregating client-side.
      const positions: any[] = await (program.account as any).plantPosition.all([
        {
          memcmp: {
            offset: 8, // skip the 8-byte account discriminator
            bytes: new anchor.BN(seasonId).toArrayLike(Buffer, "le", 8).toString("base64"),
            encoding: "base64",
          },
        },
      ]);

      const mintInfo = await getMint(program.provider.connection, account.mint);
      const divisor = 10 ** mintInfo.decimals;
      const totalPlantedRaw = positions.reduce(
        (sum, p) => sum + p.account.amount.toNumber(),
        0
      );

      setSeason({
        seasonId: account.seasonId.toNumber(),
        authority: account.authority.toBase58(),
        mint: account.mint.toBase58(),
        status: parseStatus(account.status),
        description: account.description,
        plantingStart: account.plantingStart.toNumber(),
        plantingEnd: account.plantingEnd.toNumber(),
        harvestDate: account.harvestDate.toNumber(),
        minimumDeposit: account.minimumDeposit.toNumber(),
        depositIncrement: account.depositIncrement.toNumber(),
        rewardPoolAmount: account.rewardPoolAmount.toNumber(),
        receiptMetadataUri: account.receiptMetadataUri,
        totalPlanted: Math.round(totalPlantedRaw / divisor),
        participantCount: positions.length,
      });
      setError(null);
    } catch (e: any) {
      setError(e.message ?? "Failed to load season data");
      setSeason(null);
    } finally {
      setLoading(false);
    }
  }, [anchorWallet, seasonId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { season, loading, error, refetch };
}