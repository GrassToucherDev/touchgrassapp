"use client";

import { useCallback, useMemo } from "react";
import { useWallet as useSolanaWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import type { AnchorWallet } from "@solana/wallet-adapter-react";

export interface WalletState {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  shortAddress: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  // The real wallet object, needed only by code that actually signs and
  // sends transactions (lib/harvest/program.ts). Everything else in the
  // app should keep using the simplified fields above.
  anchorWallet: AnchorWallet | undefined;
}

function shorten(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function useWalletState(): WalletState {
  const { publicKey, connected, connecting, disconnect: adapterDisconnect } = useSolanaWallet();
  const { setVisible } = useWalletModal();
  const anchorWallet = useAnchorWallet();

  const connect = useCallback(async () => {
    setVisible(true);
  }, [setVisible]);

  const disconnect = useCallback(() => {
    void adapterDisconnect();
  }, [adapterDisconnect]);

  const address = useMemo(() => (publicKey ? publicKey.toBase58() : null), [publicKey]);

  return {
    connected,
    connecting,
    address,
    shortAddress: address ? shorten(address) : null,
    connect,
    disconnect,
    anchorWallet,
  };
}
