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
    <Card className="flex flex-col gap-1">
      <span className="text-xl" aria-hidden="true">
        {icon}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</span>
      <span className="font-display text-xl font-bold text-ink">{value}</span>
    </Card>
  );
}

export function SeasonStats({ season }: { season: SeasonConfig }) {
  return (
    <section aria-labelledby="season-stats-heading">
      <h2 id="season-stats-heading" className="sr-only">
        Season stats
      </h2>
      <p className="text-xs font-medium text-ink-soft">
        🔍 Preview data — figures below are sample values for Phase 1, not live totals.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard
          icon="🌱"
          label="Total Planted"
          value={`${formatCompact(season.totalPlanted)} $TOUCHGRASS`}
        />
        <StatCard
          icon="👥"
          label="Participants"
          value={formatTokenAmount(season.participantCount)}
        />
        <StatCard
          icon="📅"
          label="Planting Window"
          value={`${formatDate(season.plantingStart)} – ${formatDate(season.plantingEnd)}`}
        />
        <StatCard icon="☀️" label="Harvest Date" value={formatDate(season.harvestDate)} />
      </div>
    </section>
  );
}
