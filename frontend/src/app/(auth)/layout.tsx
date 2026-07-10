import { MessagesSquare } from "lucide-react";
import { RequireGuest } from "@/presentation/components/auth/auth-guards";
import { ThemeToggle } from "@/presentation/components/ui/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireGuest>
      <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="flex items-center justify-center gap-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              <MessagesSquare className="h-7 w-7" aria-hidden />
              Social
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Posts, chats, and more — coming together
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
            {children}
          </div>
        </div>
      </div>
    </RequireGuest>
  );
}
