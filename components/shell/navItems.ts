export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/proof-of-grass", label: "Proof of Grass", icon: "🌿" },
  { href: "/harvest", label: "Harvest", icon: "🌾" },
  { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
  { href: "/quests", label: "Quests", icon: "🧭" },
  { href: "/premium", label: "Premium+", icon: "⭐" },
  { href: "/profile", label: "Profile", icon: "👤" },
];
