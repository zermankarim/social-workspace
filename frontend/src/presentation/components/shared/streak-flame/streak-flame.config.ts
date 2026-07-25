export type StreakTier = 0 | 1 | 2 | 3 | 4;

export interface StreakTierStyle {
  /** Bright inner core fill. */
  core: string;
  /** Outer flame body fill (or stroke, for the dormant tier). */
  outer: string;
  /** Drop-shadow / spark / ring color. */
  glow: string;
  /** Flicker animation duration — flames get livelier as the streak grows. */
  speed: string;
  hasGlow: boolean;
  hasSparks: boolean;
  hasRing: boolean;
}

/**
 * Tier thresholds line up with the backend's badge thresholds
 * (streak_7 / streak_30 in gamification.service.ts).
 */
export function getStreakTier(streak: number): StreakTier {
  if (streak <= 0) return 0;
  if (streak < 3) return 1;
  if (streak < 7) return 2;
  if (streak < 30) return 3;
  return 4;
}

/**
 * Color story follows real flame physics: cooler orange embers get
 * progressively hotter and end up blue-white at the top tier, rather
 * than an arbitrary color ramp.
 */
export const STREAK_TIER_STYLE: Record<StreakTier, StreakTierStyle> = {
  0: {
    core: "#c9c6c0",
    outer: "#c9c6c0",
    glow: "transparent",
    speed: "0s",
    hasGlow: false,
    hasSparks: false,
    hasRing: false,
  },
  1: {
    core: "#ffd166",
    outer: "#ff8a3d",
    glow: "rgba(255, 138, 61, 0.35)",
    speed: "2.4s",
    hasGlow: false,
    hasSparks: false,
    hasRing: false,
  },
  2: {
    core: "#ffe08a",
    outer: "#ff6a00",
    glow: "rgba(255, 106, 0, 0.45)",
    speed: "1.9s",
    hasGlow: true,
    hasSparks: false,
    hasRing: false,
  },
  3: {
    core: "#ffd166",
    outer: "#ff4d1c",
    glow: "rgba(255, 77, 28, 0.55)",
    speed: "1.5s",
    hasGlow: true,
    hasSparks: true,
    hasRing: false,
  },
  4: {
    core: "#cfe8ff",
    outer: "#5b8cff",
    glow: "rgba(91, 140, 255, 0.6)",
    speed: "1.2s",
    hasGlow: true,
    hasSparks: true,
    hasRing: true,
  },
};
