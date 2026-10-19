import { Card } from "@/components/ui/Card";
import { formatCompact, formatDate, formatTokenAmount } from "@/lib/harvest/utils";
import type { SeasonConfig } from "@/lib/harvest/types";

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex min-w-0 flex-col gap-1">
      <span className="text-xl" aria-hidden="true">
        {icon}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</span>
      <span className="break-words font-display text-xl font-bold leading-tight text-ink sm:text-2xl">{value}</span>
    </Card>
  );
}

export function SeasonStats({ season }: { season: SeasonConfig }) {
  return (
    <section aria-labelledby="season-stats-heading">
      <h2 id="season-stats-heading" className="sr-only">
        Season stats
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard
          icon="🔒"
          label="Total Locked"
          value={`${formatCompact(season.totalLocked)} $TOUCHGRASS`}
        />
        <StatCard
          icon="👥"
          label="Planters"
          value={formatTokenAmount(season.lockedParticipantCount)}
        />
        <StatCard
          icon="📅"
          label="Planting Window"
          value={`${formatDate(season.plantingStart)} – ${formatDate(season.plantingEnd)}`}
        />
        <StatCard icon="☀️" label="Harvest Date" value={formatDate(season.harvestDate)} />
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        Live from the Harvest program on Solana. Locked = principal currently held in escrow.
      </p>
    </section>
  );
}
