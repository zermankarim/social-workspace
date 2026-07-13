import { FeedCard } from "@/presentation/components/feed/feed-card";
import {
  MOCK_NEWS_ITEMS,
  MOCK_SUGGESTIONS,
} from "@/presentation/mocks/feed.mock";
import { Button } from "@/presentation/components/ui/button";

export function FeedRightRail() {
  return (
    <aside className="space-y-2">
      <FeedCard className="px-3 py-3">
        <h2 className="text-sm font-semibold text-foreground">News</h2>
        <p className="mt-0.5 text-[11px] text-muted">Top stories · mock</p>
        <ul className="mt-3 space-y-3">
          {MOCK_NEWS_ITEMS.map((item) => (
            <li key={item.id}>
              <p className="text-xs font-semibold text-foreground hover:text-primary">
                {item.title}
              </p>
              <p className="text-[11px] text-muted">{item.readers}</p>
            </li>
          ))}
        </ul>
      </FeedCard>

      <FeedCard className="px-3 py-3">
        <h2 className="text-sm font-semibold text-foreground">
          People you may know
        </h2>
        <ul className="mt-3 space-y-3">
          {MOCK_SUGGESTIONS.map((person) => (
            <li key={person.id} className="flex items-start gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                {person.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  {person.name}
                </p>
                <p className="truncate text-[11px] text-muted">
                  {person.headline}
                </p>
                <Button
                  variant="secondary"
                  disabled
                  className="mt-1.5 h-7 px-3 text-xs"
                >
                  Connect
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[10px] text-muted">
          Suggestions will appear when a recommendations API is available.
        </p>
      </FeedCard>
    </aside>
  );
}
