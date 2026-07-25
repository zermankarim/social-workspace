"use client";

import { ChevronDown } from "lucide-react";
import { forwardRef, type ChangeEvent, type SelectHTMLAttributes } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "onChange" | "children"
> & {
  label: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  /** Visually hide the label (still announced for a11y). */
  hideLabel?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      options,
      onChange,
      error,
      id,
      className = "",
      placeholder,
      value,
      disabled,
      hideLabel = false,
      ...props
    },
    ref,
  ) {
    const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    function handleChange(event: ChangeEvent<HTMLSelectElement>) {
      onChange(event.target.value);
    }

    return (
      <div className="flex min-w-0 flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className={
            hideLabel ? "sr-only" : "text-sm font-medium text-foreground"
          }
        >
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            value={value}
            disabled={disabled}
            onChange={handleChange}
            className={`w-full appearance-none rounded-lg border border-border-strong bg-surface py-2 pr-10 pl-3 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 ${
              error ? "border-danger focus:ring-danger/20" : ""
            } ${className}`}
            {...props}
          >
            {placeholder ? <option value="">{placeholder}</option> : null}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
        </div>
        {error ? <p className="text-xs text-danger">{error}</p> : null}
      </div>
    );
  },
);
