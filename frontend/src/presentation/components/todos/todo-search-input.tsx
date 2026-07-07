"use client";

import { Search, X } from "lucide-react";

interface TodoSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TodoSearchInput({
  value,
  onChange,
  disabled = false,
}: TodoSearchInputProps) {
  return (
    <div className="relative w-full">
      <label htmlFor="todo-search" className="sr-only">
        Search tasks
      </label>
      <input
        id="todo-search"
        type="text"
        role="searchbox"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder="Search tasks…"
        className={`h-10 w-full rounded-lg border border-sky-200/90 bg-white/90 py-2 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200/80 disabled:cursor-not-allowed disabled:bg-white/60 disabled:text-zinc-400 dark:border-sky-800/80 dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-sky-600 dark:focus:ring-sky-900/50 dark:disabled:bg-zinc-900/60 ${
          value ? "pr-10" : "pr-3"
        }`}
      />
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400/90"
        aria-hidden
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          disabled={disabled}
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
