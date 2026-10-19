import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[linear-gradient(135deg,#7dc832_0%,#5ba622_100%)] text-white shadow-[0_0_24px_rgba(125,200,50,0.3)] hover:brightness-95 active:brightness-90 disabled:opacity-50 disabled:shadow-none",
  secondary:
    "bg-[linear-gradient(135deg,#f5c04a_0%,#e8a020_100%)] text-field hover:brightness-95 active:brightness-90 disabled:opacity-50",
  ghost:
    "bg-white/75 text-field border-[1.5px] border-grass-light/40 hover:bg-white disabled:text-ink/30",
};

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-body font-bold tracking-[0.02em]
          transition duration-150
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grass-dark
          disabled:cursor-not-allowed disabled:shadow-none
          ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
