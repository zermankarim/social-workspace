import type { ReactNode } from "react";

const zoneStyles = {
  controls: {
    container:
      "border-sky-200/80 bg-sky-50/50 dark:border-sky-800/60 dark:bg-sky-950/40",
    label: "text-sky-800/80 dark:text-sky-300/80",
  },
  create: {
    container:
      "border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-800/60 dark:bg-emerald-950/40",
    label: "text-emerald-800/80 dark:text-emerald-300/80",
  },
  list: {
    container:
      "border-violet-200/60 bg-violet-50/30 dark:border-violet-800/50 dark:bg-violet-950/30",
    label: "text-violet-800/70 dark:text-violet-300/70",
  },
} as const;

type ZoneVariant = keyof typeof zoneStyles;

interface ZonePanelProps {
  variant: ZoneVariant;
  label: string;
  children: ReactNode;
  className?: string;
}

export function ZonePanel({
  variant,
  label,
  children,
  className = "",
}: ZonePanelProps) {
  const styles = zoneStyles[variant];

  return (
    <section
      className={`flex flex-col rounded-xl border p-3 ${styles.container} ${className}`}
    >
      <p
        className={`mb-2 text-xs font-semibold uppercase tracking-wide ${styles.label}`}
      >
        {label}
      </p>
      {children}
    </section>
  );
}
