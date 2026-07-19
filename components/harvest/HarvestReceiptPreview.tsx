import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatTokenAmount } from "@/lib/harvest/utils";
import type { PlantPosition, SeasonConfig } from "@/lib/harvest/types";
import { useWalletState } from "@/lib/wallet/useWalletState";

export function HarvestReceiptPreview({
  season,
  position,
}: {
  season: SeasonConfig;
  position: PlantPosition;
}) {
  const wallet = useWalletState();

  if (!position.receiptId) {
    return (
      <Card id="receipt">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Harvest Receipt</h2>
          <Badge tone="neutral">Non-transferable</Badge>
        </div>
        <p className="mt-3 text-sm text-ink-soft">
          Your receipt preview will appear here after you plant $TOUCHGRASS this season.
        </p>
      </Card>
    );
  }

  return (
    <Card id="receipt" tone="dark">
      <div className="flex items-center justify-between">
        <Badge tone="sun">Receipt Preview</Badge>
        <Badge tone="neutral">Non-transferable</Badge>
      </div>
      <h2 className="mt-3 font-display text-lg font-bold text-cream">{season.seasonName}</h2>
      <p className="text-xs text-cream/60">Harvest Receipt</p>

      <dl className="mt-4 space-y-2 text-sm">
        <Row label="Wallet" value={wallet.shortAddress ?? "—"} />
        <Row label="Planted amount" value={`${formatTokenAmount(position.amount)} $TOUCHGRASS`} />
        <Row label="Receipt ID" value={position.receiptId} />
        <Row label="Status" value={position.status.replace("-", " ")} />
        <Row label="Harvest date" value={formatDate(season.harvestDate)} />
      </dl>

      <p className="mt-4 text-xs text-cream/60">
        This is a visual placeholder for Phase 1. No NFT has been minted.
      </p>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-cream/60">{label}</dt>
      <dd className="font-semibold text-cream">{value}</dd>
    </div>
  );
}
