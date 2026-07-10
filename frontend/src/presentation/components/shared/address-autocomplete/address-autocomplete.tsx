"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/presentation/components/ui/input";
import { searchAddresses } from "@/presentation/components/shared/address-autocomplete/photon-client";
import type {
  AddressAutocompleteProps,
  AddressResult,
} from "@/presentation/components/shared/address-autocomplete/types";
import { useDebouncedValue } from "@/presentation/hooks/use-debounced-value";

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  label = "Location",
  placeholder = "Search for a city or address",
  error,
  disabled = false,
  className = "",
  countryRestriction,
}: AddressAutocompleteProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const skipNextSearchRef = useRef(false);
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebouncedValue(value, 350);

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    const query = debouncedQuery.trim();
    const controller = new AbortController();
    let cancelled = false;

    const run = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        setSearchError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setSearchError(null);

      try {
        const results = await searchAddresses(query, {
          countryRestriction,
          signal: controller.signal,
        });
        if (cancelled) return;
        setSuggestions(results);
        setIsOpen(results.length > 0);
        setActiveIndex(-1);
      } catch (err: unknown) {
        if (cancelled || controller.signal.aborted) return;
        setSuggestions([]);
        setIsOpen(false);
        setSearchError(
          err instanceof Error ? err.message : "Address search failed",
        );
      } finally {
        if (!cancelled && !controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [debouncedQuery, countryRestriction]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const selectSuggestion = (result: AddressResult) => {
    skipNextSearchRef.current = true;
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    onChange(result.formattedAddress);
    onSelect?.(result);
  };

  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      <Input
        label={label}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-autocomplete="list"
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
        onKeyDown={(e) => {
          if (!isOpen || suggestions.length === 0) {
            if (e.key === "Escape") setIsOpen(false);
            return;
          }

          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((index) =>
              index < suggestions.length - 1 ? index + 1 : 0,
            );
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((index) =>
              index > 0 ? index - 1 : suggestions.length - 1,
            );
          } else if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            selectSuggestion(suggestions[activeIndex]);
          } else if (e.key === "Escape") {
            setIsOpen(false);
            setActiveIndex(-1);
          }
        }}
      />

      {isLoading ? <p className="mt-1 text-xs text-muted">Searching…</p> : null}
      {searchError ? (
        <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
          {searchError}. You can still register without a location.
        </p>
      ) : null}

      {isOpen && suggestions.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-surface py-1 shadow-card"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.placeId ?? suggestion.formattedAddress}-${index}`}
            >
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={`flex w-full items-start gap-2 px-3 py-2 text-left text-sm ${
                  index === activeIndex
                    ? "bg-primary-soft text-foreground"
                    : "text-foreground hover:bg-surface-muted"
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
              >
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-muted"
                  aria-hidden
                />
                <span>{suggestion.formattedAddress}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
