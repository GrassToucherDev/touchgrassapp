"use client";
import "@solana/wallet-adapter-react-ui/styles.css";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

/**
 * MAINNET — real wallet connections, real transactions, real funds.
 *
 * Wallets: intentionally passed as an empty array. Phantom, Solflare, and
 * Backpack all register themselves via the Wallet Standard, so the modal
 * picks them up automatically without installing the
 * @solana/wallet-adapter-wallets package (which bundles many legacy,
 * unused adapters). If a wallet you need doesn't show up because it
 * predates Wallet Standard support, add its adapter here explicitly.
 */
export function WalletProviders({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_RPC_URL || "https://api.mainnet-beta.solana.com",
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}