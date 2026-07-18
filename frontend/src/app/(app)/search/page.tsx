"use client";

import { useSearchParams } from "next/navigation";
import { SearchResultsPage } from "@/presentation/components/search/search-results-page";

export default function SearchRoutePage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  return <SearchResultsPage query={query} />;
}
