import { NextResponse } from "next/server";

// Server-side price lookup (same DexScreener source Proof of Grass uses) so the browser
// never hits a third-party API directly. Cached briefly at the edge.
const MINT = "5314GTpDziP2ZdaANnt5KJEABGXy5Nn5Kyc3SFPYpump";

export const revalidate = 30;

export async function GET() {
  try {
    const r = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${MINT}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 30 },
    });
    if (!r.ok) throw new Error(`dexscreener ${r.status}`);
    const data = await r.json();
    // Use the deepest-liquidity pair rather than whichever happens to be listed first.
    const pairs: any[] = Array.isArray(data?.pairs) ? data.pairs : [];
    const pair = [...pairs].sort(
      (a, b) => Number(b?.liquidity?.usd ?? 0) - Number(a?.liquidity?.usd ?? 0)
    )[0];
    const price = parseFloat(pair?.priceUsd ?? "0");
    if (!(price > 0)) throw new Error("no price");
    return NextResponse.json(
      {
        price,
        change24h: typeof pair?.priceChange?.h24 === "number" ? pair.priceChange.h24 : null,
        marketCap: Number(pair?.marketCap ?? pair?.fdv ?? 0) || null,
        updatedAt: Date.now(),
      },
      { headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" } }
    );
  } catch {
    return NextResponse.json({ error: "price_unavailable" }, { status: 502 });
  }
}
