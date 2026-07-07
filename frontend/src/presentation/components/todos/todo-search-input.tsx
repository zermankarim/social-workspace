"use client";

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
        className={`h-10 w-full rounded-lg border border-sky-200/90 bg-white/90 py-2 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200/80 disabled:cursor-not-allowed disabled:bg-white/60 disabled:text-zinc-400 ${
          value ? "pr-10" : "pr-3"
        }`}
      />
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400/90"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          disabled={disabled}
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          aria-label="Clear search"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
