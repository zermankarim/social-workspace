"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthInitializer } from "@/presentation/components/providers/auth-initializer";
import { ThemeProvider } from "@/presentation/components/providers/theme-provider";
import { createQueryClient } from "@/presentation/lib/query-client";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthInitializer>{children}</AuthInitializer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
