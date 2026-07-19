import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "default" | "dark";
}

export function Card({ tone = "default", className = "", children, ...props }: CardProps) {
  const toneClasses =
    tone === "dark" ? "bg-field text-cream" : "bg-white text-ink border border-ink/5";

  return (
    <div className={`rounded-xl3 shadow-soft p-5 sm:p-6 ${toneClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}
