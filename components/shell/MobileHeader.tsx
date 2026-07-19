import Link from "next/link";
import { WalletArea } from "./WalletArea";

export function MobileHeader() {
  return (
    <header className="flex items-center justify-between border-b border-ink/5 bg-white px-4 py-3 lg:hidden">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">
          🌻
        </span>
        <span className="font-display text-base font-extrabold text-ink">Touch Grass</span>
      </Link>
      <WalletArea />
    </header>
  );
}
