"use client";

import { Button } from "@/components/ui/Button";
import { useWalletState } from "@/lib/wallet/useWalletState";

export function WalletArea() {
  const wallet = useWalletState();

  if (wallet.connected) {
    return (
      <Button variant="ghost" size="md" onClick={wallet.disconnect}>
        🟢 {wallet.shortAddress}
      </Button>
    );
  }

  return (
    <Button variant="primary" size="md" onClick={wallet.connect} disabled={wallet.connecting}>
      {wallet.connecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
