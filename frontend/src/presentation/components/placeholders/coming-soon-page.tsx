import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { FeedCard } from "@/presentation/components/feed/feed-card";

type ComingSoonPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function ComingSoonPage({
  title,
  description,
  icon: Icon,
}: ComingSoonPageProps) {
  return (
    <div className="mx-auto max-w-xl pt-6">
      <FeedCard className="px-6 py-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Icon className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted">{description}</p>
        <p className="mt-4 text-xs text-muted">
          Backend for this area is not ready yet — this is a placeholder.
        </p>
        <Link
          href="/feed"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          Back to Home
        </Link>
      </FeedCard>
    </div>
  );
}
