import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  /** Visually hide the label (still announced for a11y). */
  hideLabel?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className = "", hideLabel = false, ...props },
  ref,
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className={
          hideLabel ? "sr-only" : "text-sm font-medium text-foreground"
        }
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={`rounded-lg border border-border-strong bg-surface px-3 py-2 text-base text-foreground placeholder:text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${error ? "border-danger focus:ring-danger/20" : ""} ${className}`}
        {...props}
      />
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
});
