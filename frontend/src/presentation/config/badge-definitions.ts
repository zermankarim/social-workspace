import type {
  BadgeCategory,
  BadgeTier,
} from "@/core/domain/entities/badge-catalog.entity";

export type BadgeDefinition = {
  key: string;
  category: BadgeCategory;
  tier: BadgeTier;
};

/**
 * Lightweight mirror of the backend badge catalog (backend/src/gamification/constants/badges.constants.ts) —
 * only category/tier, used to render an icon from a bare badge key (e.g. in
 * toasts) without waiting on a full GET /gamification/badges response.
 * Keep in sync when badges are added/removed on the backend.
 */
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { key: "streak_7", category: "streak", tier: "bronze" },
  { key: "streak_30", category: "streak", tier: "silver" },
  { key: "streak_100", category: "streak", tier: "gold" },
  { key: "streak_365", category: "streak", tier: "platinum" },
  { key: "connections_10", category: "connections", tier: "bronze" },
  { key: "connections_50", category: "connections", tier: "silver" },
  { key: "connections_100", category: "connections", tier: "gold" },
  { key: "connections_500", category: "connections", tier: "platinum" },
  { key: "followers_10", category: "followers", tier: "bronze" },
  { key: "followers_100", category: "followers", tier: "silver" },
  { key: "followers_1000", category: "followers", tier: "gold" },
  { key: "followers_10000", category: "followers", tier: "platinum" },
  { key: "posts_1", category: "posts", tier: "bronze" },
  { key: "posts_10", category: "posts", tier: "silver" },
  { key: "posts_50", category: "posts", tier: "gold" },
  { key: "posts_200", category: "posts", tier: "platinum" },
  { key: "likes_received_50", category: "likesReceived", tier: "bronze" },
  { key: "likes_received_500", category: "likesReceived", tier: "silver" },
  { key: "likes_received_5000", category: "likesReceived", tier: "gold" },
  { key: "comments_received_25", category: "commentsReceived", tier: "bronze" },
  {
    key: "comments_received_250",
    category: "commentsReceived",
    tier: "silver",
  },
  { key: "comments_received_2500", category: "commentsReceived", tier: "gold" },
  { key: "endorsements_5", category: "endorsementsReceived", tier: "bronze" },
  { key: "endorsements_25", category: "endorsementsReceived", tier: "silver" },
  { key: "endorsements_100", category: "endorsementsReceived", tier: "gold" },
  { key: "points_100", category: "points", tier: "bronze" },
  { key: "points_1000", category: "points", tier: "silver" },
  { key: "points_10000", category: "points", tier: "gold" },
  { key: "points_50000", category: "points", tier: "platinum" },
  { key: "profile_complete", category: "profile", tier: "gold" },
  { key: "applications_1", category: "applications", tier: "bronze" },
  { key: "applications_10", category: "applications", tier: "silver" },
  { key: "applications_50", category: "applications", tier: "gold" },
  { key: "first_hire", category: "applications", tier: "platinum" },
  { key: "experience_1y", category: "experience", tier: "bronze" },
  { key: "experience_3y", category: "experience", tier: "silver" },
  { key: "experience_5y", category: "experience", tier: "gold" },
  { key: "experience_10y", category: "experience", tier: "platinum" },
];

export const BADGE_DEFINITIONS_BY_KEY: Record<string, BadgeDefinition> =
  Object.fromEntries(BADGE_DEFINITIONS.map((def) => [def.key, def]));
