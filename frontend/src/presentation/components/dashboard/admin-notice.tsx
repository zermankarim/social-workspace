import Link from "next/link";

export function AdminNotice() {
  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
      <h2 className="text-sm font-semibold text-violet-900">Administrator</h2>
      <p className="mt-1.5 text-sm text-violet-800">
        Manage accounts in the{" "}
        <Link
          href="/admin/users"
          className="font-medium underline underline-offset-2 hover:text-violet-950"
        >
          Users
        </Link>{" "}
        section.
      </p>
    </section>
  );
}
