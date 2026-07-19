import { Card } from "./Card";

export function EmptyState({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <Card className="flex flex-col items-center gap-2 py-12 text-center">
      <span className="text-4xl" aria-hidden="true">
        {icon}
      </span>
      <h1 className="font-display text-xl font-bold text-ink">{title}</h1>
      <p className="max-w-sm text-sm text-ink-soft">{body}</p>
      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sun/20 px-3 py-1 text-xs font-semibold text-harvest-dark">
        Coming soon
      </span>
    </Card>
  );
}
