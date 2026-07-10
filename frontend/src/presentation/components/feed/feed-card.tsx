import type { ReactNode } from "react";

type FeedCardProps = {
  children: ReactNode;
  className?: string;
};

export function FeedCard({ children, className = "" }: FeedCardProps) {
  return (
    <section className={`rounded-lg bg-surface shadow-card ${className}`}>
      {children}
    </section>
  );
}
