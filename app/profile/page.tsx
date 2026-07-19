"use client";

import { PageHeader } from "@/components/shell/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { useWalletState } from "@/lib/wallet/useWalletState";

export default function ProfilePage() {
  const wallet = useWalletState();

  return (
    <div className="pb-10">
      <PageHeader title="Profile" />
      <div className="mt-6 space-y-4 px-4 sm:px-8">
        {wallet.connected && (
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Connected wallet
            </p>
            <p className="mt-1 font-display text-lg font-bold text-ink">{wallet.shortAddress}</p>
          </Card>
        )}
        <EmptyState
          icon="👤"
          title="Profile is coming soon"
          body="Your wallet, stats, and Touch Grass history will live here. This section isn't built yet."
        />
      </div>
    </div>
  );
}
