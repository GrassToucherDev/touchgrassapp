"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SeasonCountdown } from "@/components/harvest/SeasonCountdown";
import { useSeasonData } from "@/lib/harvest/useSeasonData";
import { useTokenPrice, formatPrice } from "@/lib/useTokenPrice";
import { formatCompact, formatTokenAmount } from "@/lib/harvest/utils";
import { EcosystemBanners } from "./EcosystemBanners";

const ACTIVE_SEASON_ID = 1;

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-cream/60">{label}</p>
      <p className="mt-0.5 break-words font-display text-2xl font-bold text-cream sm:text-3xl">{value}</p>
    </div>
  );
}

function SeasonCard() {
  const { season, loading, error, refetch } = useSeasonData(ACTIVE_SEASON_ID);

  return (
    <section
      aria-labelledby="season-card-heading"
      className="relative overflow-hidden rounded-xl3 bg-field p-5 shadow-soft sm:p-6 lg:col-span-2"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 opacity-15"
      />
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/harvest-logo.png" alt="Harvest" width={900} height={291} className="h-auto w-56 drop-shadow-lg sm:w-72" />
        <h2 id="season-card-heading" className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-sun">
          Season {ACTIVE_SEASON_ID} · Total locked
        </h2>

        {season ? (
          <>
            <p className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-display text-4xl font-bold leading-none text-cream min-[380px]:text-5xl sm:text-6xl" aria-live="polite">
              <span className="max-w-full break-words">{formatTokenAmount(season.totalLocked)}</span>
              <span className="text-lg font-bold text-cream/70 sm:text-2xl">$TOUCHGRASS</span>
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:max-w-md">
              <Stat label="Planters" value={formatTokenAmount(season.lockedParticipantCount)} />
              <Stat label="Planted all-time" value={formatCompact(season.totalPlanted)} />
            </div>
            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <SeasonCountdown targetIso={new Date(season.harvestDate * 1000).toISOString()} />
              <Link
                href="/harvest"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#7dc832_0%,#5ba622_100%)] px-6 py-3.5 text-base font-bold text-white shadow-[0_0_24px_rgba(125,200,50,0.3)] transition hover:brightness-95"
              >
                🌾 Plant $TOUCHGRASS
              </Link>
            </div>
          </>
        ) : loading ? (
          <p className="mt-4 text-sm text-cream/70">Loading live season data…</p>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-cream/80">Couldn&apos;t load live Harvest data right now.</p>
            {error && <p className="mt-1 text-xs text-cream/50">{error}</p>}
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-3 rounded-full border border-cream/30 px-4 py-2 text-sm font-semibold text-cream"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function PriceCard() {
  const { data, loading, error } = useTokenPrice();
  const up = (data?.change24h ?? 0) >= 0;

  return (
    <Card className="flex flex-col justify-between" aria-labelledby="price-card-heading">
      <div>
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
          <h2 id="price-card-heading" className="font-display text-xl font-bold text-field">
            $TOUCHGRASS price
          </h2>
        </div>

        {data ? (
          <>
            <p className="mt-3 font-display text-4xl font-bold leading-none text-field sm:text-5xl" aria-live="polite">
              {formatPrice(data.price)}
            </p>
            {data.change24h !== null && (
              <p
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                  up ? "bg-grass-light/20 text-grass-dark" : "bg-red-100 text-red-700"
                }`}
              >
                {up ? "▲" : "▼"} {Math.abs(data.change24h).toFixed(2)}% · 24h
              </p>
            )}
            {data.marketCap ? (
              <p className="mt-3 text-sm text-ink-soft">
                Market cap <span className="font-semibold text-field">${formatCompact(data.marketCap)}</span>
              </p>
            ) : null}
          </>
        ) : loading ? (
          <p className="mt-3 text-sm text-ink-soft">Loading price…</p>
        ) : (
          <p className="mt-3 text-sm text-ink-soft">{error ? "Price unavailable right now." : ""}</p>
        )}
      </div>
      <p className="mt-4 text-xs text-ink-soft">Live from DexScreener · refreshes every minute</p>
    </Card>
  );
}

export function DashboardContent() {
  return (
    <div className="space-y-8 px-4 pb-10 pt-6 sm:px-8">
      <div className="grid gap-4 lg:grid-cols-3">
        <SeasonCard />
        <PriceCard />
      </div>
      <EcosystemBanners />
    </div>
  );
}
