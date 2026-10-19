"use client";

import { useEffect, useState } from "react";

export interface TokenPrice {
  price: number;
  change24h: number | null;
  marketCap: number | null;
}

/** Live $TOUCHGRASS price from our own /api/price route. Refreshes every minute. */
export function useTokenPrice() {
  const [data, setData] = useState<TokenPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const r = await fetch("/api/price");
        if (!r.ok) throw new Error("bad status");
        const d = await r.json();
        if (!cancelled) {
          setData({ price: d.price, change24h: d.change24h ?? null, marketCap: d.marketCap ?? null });
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { data, loading, error };
}

/** Memecoin prices are tiny, so show enough significant digits: 0.00001234 -> "$0.00001234". */
export function formatPrice(price: number): string {
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  const digits = Math.min(10, Math.max(4, -Math.floor(Math.log10(price)) + 3));
  return `$${price.toFixed(digits)}`;
}
