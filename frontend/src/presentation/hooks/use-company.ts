"use client";

import { useQuery } from "@tanstack/react-query";
import { appContainer } from "@/modules/app.container";

export function useCompany(name: string | undefined) {
  return useQuery({
    queryKey: ["company", name ?? ""],
    queryFn: () => appContainer.companyService.getByName(name!),
    enabled: Boolean(name),
  });
}
