"use client";

import { useCallback } from "react";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export interface WalletState {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  shortAddress: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

function shorten(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/**
 * Every app component reads wallet state through this hook rather than
 * @solana/wallet-adapter-react directly. If the underlying library ever
 * changes (e.g. to @solana/kit + @solana/react-hooks), only this file
 * needs to change — the returned shape stays the same.
 */
export function useWalletState(): WalletState {
  const { publicKey, connected, connecting, disconnect: adapterDisconnect } = useSolanaWallet();
  const { setVisible } = useWalletModal();

  // "Connect" opens the wallet-selection modal; the adapter completes the
  // actual connection once the person picks a wallet.
  const connect = useCallback(async () => {
    setVisible(true);
  }, [setVisible]);

  const disconnect = useCallback(() => {
    void adapterDisconnect();
  }, [adapterDisconnect]);

  const address = publicKey ? publicKey.toBase58() : null;

  return {
    connected,
    connecting,
    address,
    shortAddress: address ? shorten(address) : null,
    connect,
    disconnect,
  };
}
