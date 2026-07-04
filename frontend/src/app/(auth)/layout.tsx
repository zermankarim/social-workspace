import { RequireGuest } from "@/components/auth/auth-guards";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireGuest>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Todo List
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Manage your tasks with role-based access
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </RequireGuest>
  );
}
