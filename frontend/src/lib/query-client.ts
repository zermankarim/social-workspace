import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) => {
          if (
            error &&
            typeof error === "object" &&
            "status" in error &&
            (error as { status: number }).status === 401
          ) {
            return false;
          }
          return failureCount < 1;
        },
      },
    },
  });
}
