export type BadgeTier = "bronze" | "silver" | "gold" | "platinum";

export type BadgeCategory =
  | "streak"
  | "connections"
  | "followers"
  | "posts"
  | "likesReceived"
  | "commentsReceived"
  | "endorsementsReceived"
  | "points"
  | "profile"
  | "applications"
  | "experience";

export class BadgeCatalogItem {
  constructor(
    public readonly key: string,
    public readonly category: BadgeCategory,
    public readonly tier: BadgeTier,
    public readonly threshold: number,
    public readonly bonusPoints: number,
    public readonly earned: boolean,
    public readonly earnedAt: Date | null,
    public readonly progressCurrent: number,
  ) {}

  get progressPercent(): number {
    if (this.earned) return 100;
    return Math.min(
      100,
      Math.round((this.progressCurrent / this.threshold) * 100),
    );
  }
}

export class BadgeCatalog {
  constructor(
    public readonly badges: BadgeCatalogItem[],
    public readonly totalEarned: number,
    public readonly totalCount: number,
  ) {}
}
