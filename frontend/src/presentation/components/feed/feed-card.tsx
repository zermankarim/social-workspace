import type { ReactNode } from "react";

type FeedCardProps = {
  children: ReactNode;
  className?: string;
};

export function FeedCard({ children, className = "" }: FeedCardProps) {
  return (
    <section
      className={`rounded-xl bg-surface shadow-card transition-shadow ${className}`}
    >
      {children}
    </section>
  );
}
