import type { ButtonHTMLAttributes } from "react";

const base =
  "inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100";

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover hover:shadow-md",
  secondary:
    "border border-border-strong bg-surface text-foreground hover:bg-surface-muted hover:border-foreground",
  ghost: "text-muted hover:bg-surface-muted hover:text-foreground",
  danger: "bg-danger text-white hover:opacity-90",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
