import Link from "next/link";
import { WalletArea } from "./WalletArea";

export function MobileHeader() {
  return (
    <header className="flex items-center justify-between border-b border-white/60 bg-white/85 backdrop-blur-xl shadow-[0_2px_16px_rgba(26,74,10,0.08)] px-4 py-3 lg:hidden">
      <Link href="/" className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
        <span className="font-display text-xl font-bold text-ink">Touch Grass</span>
      </Link>
      <WalletArea />
    </header>
  );
}
