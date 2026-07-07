import { ProfileRole } from "@/core/domain/enums/profile-role.enum";

const roleStyles: Record<ProfileRole, string> = {
  ADMIN:
    "bg-violet-100 text-violet-800 ring-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:ring-violet-800",
  USER: "bg-sky-100 text-sky-800 ring-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-800",
};

export function RoleBadge({ role }: { role: ProfileRole }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${roleStyles[role]}`}
    >
      {role}
    </span>
  );
}
