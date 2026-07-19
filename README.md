# Touch Grass App — Phase 1 scaffold (app.touchgrass.today)

A new, separate Next.js application for the Touch Grass ecosystem (Dashboard, Proof of Grass,
Harvest, Leaderboard, Quests, Premium+, Profile). **Harvest is the only fully functional
feature in this phase** — everything else is a branded placeholder. This does not touch or
depend on the existing static `touchgrass.today` site in any way.

> Built without direct access to your repo/style.css, based on the screenshot of your
> `touchgrass-site` deployment (file list + `index.html` `<head>`) and your stated brand
> direction. See "What's a best guess" below for what to double-check.

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Before you rely on this

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
```

**I could not run any of these myself** — this sandbox has no package registry access, so
nothing here has been installed, linted, type-checked, tested, or built. I reviewed every file
by hand for import/logic correctness, but please run the sequence above locally before trusting
it. One specific risk to watch for: `@solana/wallet-adapter-react` (~0.15.x) hasn't been updated
in about a year and may declare a peer dependency on React 17/18, not 19. If `npm install` fails
on a peer-dependency conflict, retry with `npm install --legacy-peer-deps` — the alternative is
downgrading to Next.js 15 / React 18, which is also a fully supported line right now.

## What's a best guess vs. confirmed

**Confirmed from your screenshot:**
- Existing site is static HTML/CSS/JS (`index.html`, `style.css`, `script.js`, `assets/`), deployed
  as the Vercel project `touchgrass-site` — untouched by this new app
- Real fonts: Nunito (weights 400–900) and DM Sans, loaded via Google Fonts — used here

**Best guess, please verify:**
- Exact brand hex values in `app/globals.css`'s `@theme` block (cream/grass/sun/harvest/field) —
  I don't have your real `style.css`, so I reused the palette from the earlier Harvest mockup
  discussion. If you can share `style.css`, I'll swap these to your exact values.
- Icon choices (emoji) throughout are placeholders for wherever you have real iconography/SVGs

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (CSS-first `@theme` config, no
`tailwind.config.ts`) · `@solana/wallet-adapter-react` + `-react-ui` (classic adapter, per your
choice) · Vitest + Testing Library

## Project structure

```
app/
  layout.tsx              Root layout — fonts, WalletProviders, AppShell
  globals.css              Tailwind v4 tokens (@theme) + wallet modal style overrides
  page.tsx                 / — dashboard with feature cards
  harvest/page.tsx         /harvest — fully functional Phase 1
  proof-of-grass/page.tsx  Coming soon
  leaderboard/page.tsx     Coming soon
  quests/page.tsx          Coming soon
  premium/page.tsx         Coming soon
  profile/page.tsx         Coming soon (shows connected wallet if any)
components/
  shell/                   Sidebar (desktop), MobileNav (bottom bar), MobileHeader,
                            WalletArea, PageHeader, AppShell, navItems config
  ui/                      Button, Card, Badge, Modal, EmptyState
  harvest/                 HarvestPageContent (owns position state) + all Harvest sections
lib/
  wallet/
    WalletProviders.tsx     ConnectionProvider/WalletProvider/WalletModalProvider setup
    useWalletState.ts        Thin abstraction — every component reads wallet state through this
  harvest/
    types.ts, mockData.ts, utils.ts   Same pattern as before: one centralized mock config
tests/
  mocks/walletState.ts      Controllable mock wallet used by all component tests
  *.test.ts(x)              Vitest + Testing Library suite
```

## Wallet architecture

Real wallet **connection** works (Phantom/Solflare/Backpack via Wallet Standard auto-detection —
no need for the `@solana/wallet-adapter-wallets` package, which bundles many unused legacy
adapters). No transactions are sent anywhere in this phase.

Every component reads wallet state through `lib/wallet/useWalletState()`, not
`@solana/wallet-adapter-react` directly. That hook returns a small stable shape
(`connected`, `address`, `shortAddress`, `connect()`, `disconnect()`). If you ever swap wallet
libraries, only that one file changes.

`components/harvest/*` are otherwise the same components from the first Harvest scaffold,
carried over and reconnected to the real wallet hook instead of a stub — the design paid off
here, since no component logic needed to change.

## How the Plant preview flow works

Unchanged from before: `PlantWidget` holds the selected amount (50,000 minimum, ±50,000 steps,
integer-only), opens `PlantConfirmationModal` on "Plant $TOUCHGRASS", and "Confirm Preview" calls
`onPlantConfirmed(amount)` up to `HarvestPageContent`, which derives a `PlantPosition` from the
mock season config and re-renders `PositionCard` + `HarvestReceiptPreview`. No `fetch` call, no
wallet `sendTransaction`, anywhere in this flow — the "no transaction" tests assert this directly.

## Deployment

1. New GitHub repo, separate from your static site's repo:
   ```bash
   git init
   git add .
   git commit -m "Touch Grass App — Phase 1 scaffold"
   git branch -M main
   git remote add origin https://github.com/GrassToucherDev/<new-repo-name>.git
   git push -u origin main
   ```
2. In Vercel: **New Project** → import that repo → framework preset auto-detects Next.js → Deploy.
   This creates a brand-new Vercel project, completely separate from `touchgrass-site`.
3. Connect the subdomain: in the new Vercel project → **Settings → Domains** → add
   `app.touchgrass.today`. Vercel shows a CNAME target (typically `cname.vercel-dns.com`). Add
   that as a CNAME record for the `app` host in whichever DNS provider manages `touchgrass.today`.
   The apex domain / root site's DNS records are untouched — subdomain and apex route
   independently, so there's no risk to the live static site.

## Known limitations / follow-up work

- Not run through install/lint/typecheck/test/build locally yet — see "Before you rely on this."
- Brand hex values are a best guess pending your real `style.css`.
- I did not add a Harvest-specific in-page section nav (the brief's optional item) since the app
  now has a real global Sidebar/MobileNav that already links to `/harvest` — an extra per-page nav
  felt redundant. Happy to add one if you want in-page anchors for a longer Harvest page.
- `Math.random()` is used once, for mock receipt IDs — only inside the Plant confirmation click
  handler, never during render, per your "no Math.random()/Date.now() in render" convention.
- Mobile horizontal-overflow is covered by Tailwind discipline (flex-wrap, `min-w-0`) and a jsdom
  smoke test only — add a Playwright viewport test (375px) for a real guarantee.
- No `/proof-of-grass`, `/leaderboard`, `/quests`, `/premium`, `/profile` functionality yet — all
  five are intentionally simple placeholders per the brief.
# touchgrassapp
