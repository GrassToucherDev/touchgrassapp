import { WalletArea } from "./WalletArea";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex items-start justify-between gap-4 px-4 pt-6 sm:px-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      <div className="hidden sm:block">
        <WalletArea />
      </div>
    </header>
  );
}
