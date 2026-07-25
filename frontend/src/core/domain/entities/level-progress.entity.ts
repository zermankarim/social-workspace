export class LevelProgress {
  constructor(
    public readonly key: string,
    public readonly minPoints: number,
    public readonly nextLevelKey: string | null,
    public readonly nextLevelPoints: number | null,
    public readonly progressPercent: number,
  ) {}
}
