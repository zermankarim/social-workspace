import { Shield } from "lucide-react";
import Link from "next/link";

export function AdminNotice() {
  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800/60 dark:bg-violet-950/40">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-violet-900 dark:text-violet-200">
        <Shield className="h-4 w-4" aria-hidden />
        Administrator
      </h2>
      <p className="mt-1.5 text-sm text-violet-800 dark:text-violet-300">
        Manage accounts in the{" "}
        <Link
          href="/admin/users"
          className="font-medium underline underline-offset-2 hover:text-violet-950 dark:hover:text-violet-100"
        >
          Users
        </Link>{" "}
        section.
      </p>
    </section>
  );
}
