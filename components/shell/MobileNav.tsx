"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./navItems";

// Bottom nav shows the most-used items; the rest are reachable from the
// Dashboard cards. Keeping this to 5 slots avoids cramped tap targets.
const MOBILE_ITEMS = NAV_ITEMS.filter((item) =>
  ["/", "/harvest", "/quests", "/leaderboard", "/profile"].includes(item.href)
);

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink/10 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {MOBILE_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold
              focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-grass-dark
              ${active ? "text-grass-dark" : "text-ink-soft"}`}
          >
            <span className="text-lg" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
