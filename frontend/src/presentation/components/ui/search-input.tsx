"use client";

import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  id?: string;
}

export function SearchInput({
  value,
  onChange,
  disabled = false,
  placeholder = "Search…",
  label = "Search",
  id = "search",
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="text"
        role="searchbox"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`h-10 w-full rounded-lg border border-border-strong bg-surface py-2 pl-9 text-base text-foreground placeholder:text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted ${
          value ? "pr-10" : "pr-3"
        }`}
      />
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          disabled={disabled}
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
