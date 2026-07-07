import type { ReactNode } from "react";

const zoneStyles = {
  controls: {
    container: "border-sky-200/80 bg-sky-50/50",
    label: "text-sky-800/80",
  },
  create: {
    container: "border-emerald-200/80 bg-emerald-50/50",
    label: "text-emerald-800/80",
  },
  list: {
    container: "border-violet-200/60 bg-violet-50/30",
    label: "text-violet-800/70",
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
