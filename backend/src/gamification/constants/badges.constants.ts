export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type BadgeCategory =
  | 'streak'
  | 'connections'
  | 'followers'
  | 'posts'
  | 'likesReceived'
  | 'commentsReceived'
  | 'endorsementsReceived'
  | 'points'
  | 'profile';

export type BadgeStats = {
  longestStreak: number;
  connectionsCount: number;
  followersCount: number;
  postsCount: number;
  likesReceivedCount: number;
  commentsReceivedCount: number;
  endorsementsReceivedCount: number;
  pointsBalance: number;
  profileCompletionPercent: number;
};

export type BadgeDefinition = {
  key: string;
  category: BadgeCategory;
  tier: BadgeTier;
  threshold: number;
  bonusPoints: number;
  statKey: keyof BadgeStats;
};

function tier(
  statKey: keyof BadgeStats,
  category: BadgeCategory,
  entries: Array<
    [key: string, threshold: number, tier: BadgeTier, bonusPoints: number]
  >,
): BadgeDefinition[] {
  return entries.map(([key, threshold, badgeTier, bonusPoints]) => ({
    key,
    category,
    tier: badgeTier,
    threshold,
    bonusPoints,
    statKey,
  }));
}

/** Achievement catalog. Ordered by category, then tier. Thresholds are permanent once earned — see UserBadge. */
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  ...tier('longestStreak', 'streak', [
    ['streak_7', 7, 'bronze', 10],
    ['streak_30', 30, 'silver', 25],
    ['streak_100', 100, 'gold', 75],
    ['streak_365', 365, 'platinum', 200],
  ]),
  ...tier('connectionsCount', 'connections', [
    ['connections_10', 10, 'bronze', 10],
    ['connections_50', 50, 'silver', 25],
    ['connections_100', 100, 'gold', 75],
    ['connections_500', 500, 'platinum', 200],
  ]),
  ...tier('followersCount', 'followers', [
    ['followers_10', 10, 'bronze', 10],
    ['followers_100', 100, 'silver', 25],
    ['followers_1000', 1000, 'gold', 75],
    ['followers_10000', 10000, 'platinum', 200],
  ]),
  ...tier('postsCount', 'posts', [
    ['posts_1', 1, 'bronze', 10],
    ['posts_10', 10, 'silver', 25],
    ['posts_50', 50, 'gold', 75],
    ['posts_200', 200, 'platinum', 200],
  ]),
  ...tier('likesReceivedCount', 'likesReceived', [
    ['likes_received_50', 50, 'bronze', 10],
    ['likes_received_500', 500, 'silver', 25],
    ['likes_received_5000', 5000, 'gold', 75],
  ]),
  ...tier('commentsReceivedCount', 'commentsReceived', [
    ['comments_received_25', 25, 'bronze', 10],
    ['comments_received_250', 250, 'silver', 25],
    ['comments_received_2500', 2500, 'gold', 75],
  ]),
  ...tier('endorsementsReceivedCount', 'endorsementsReceived', [
    ['endorsements_5', 5, 'bronze', 10],
    ['endorsements_25', 25, 'silver', 25],
    ['endorsements_100', 100, 'gold', 75],
  ]),
  ...tier('pointsBalance', 'points', [
    ['points_100', 100, 'bronze', 10],
    ['points_1000', 1000, 'silver', 25],
    ['points_10000', 10000, 'gold', 75],
    ['points_50000', 50000, 'platinum', 200],
  ]),
  ...tier('profileCompletionPercent', 'profile', [
    ['profile_complete', 100, 'gold', 20],
  ]),
];

export function isBadgeEarned(
  badge: BadgeDefinition,
  stats: BadgeStats,
): boolean {
  return stats[badge.statKey] >= badge.threshold;
}

/** Highest not-yet-earned threshold in the same category, for progress bars. Null once every tier is earned. */
export function nextTierInCategory(
  badge: BadgeDefinition,
  earnedKeys: ReadonlySet<string>,
): BadgeDefinition | null {
  const sameCategory = BADGE_DEFINITIONS.filter(
    (b) => b.category === badge.category,
  );
  return (
    sameCategory.find(
      (b) => b.threshold > badge.threshold && !earnedKeys.has(b.key),
    ) ?? null
  );
}
