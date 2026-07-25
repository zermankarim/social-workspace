export type LevelDefinition = {
  key: string;
  minPoints: number;
};

/** Derived purely from lifetime pointsBalance — no persistence needed. */
export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  { key: 'novice', minPoints: 0 },
  { key: 'contributor', minPoints: 100 },
  { key: 'active_member', minPoints: 500 },
  { key: 'expert', minPoints: 2000 },
  { key: 'influencer', minPoints: 5000 },
  { key: 'legend', minPoints: 15000 },
];

export type LevelProgress = {
  key: string;
  minPoints: number;
  nextLevelKey: string | null;
  nextLevelPoints: number | null;
  progressPercent: number;
};

export function getLevelProgress(points: number): LevelProgress {
  let currentIndex = 0;
  for (let i = 0; i < LEVEL_DEFINITIONS.length; i++) {
    if (points >= LEVEL_DEFINITIONS[i].minPoints) {
      currentIndex = i;
    }
  }
  const current = LEVEL_DEFINITIONS[currentIndex];
  const next = LEVEL_DEFINITIONS[currentIndex + 1] ?? null;
  const progressPercent = next
    ? Math.round(
        ((points - current.minPoints) / (next.minPoints - current.minPoints)) *
          100,
      )
    : 100;

  return {
    key: current.key,
    minPoints: current.minPoints,
    nextLevelKey: next?.key ?? null,
    nextLevelPoints: next?.minPoints ?? null,
    progressPercent,
  };
}
