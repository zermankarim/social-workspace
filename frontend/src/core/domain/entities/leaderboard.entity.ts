export type LeaderboardScope = "network" | "global";
export type LeaderboardPeriod = "week" | "month" | "all";

export class LeaderboardEntry {
  constructor(
    public readonly rank: number,
    public readonly userId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly avatarUrl: string | null,
    public readonly headline: string | null,
    public readonly points: number,
    public readonly isCurrentUser: boolean,
  ) {}

  get displayName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get initials(): string {
    return `${this.firstName[0] ?? ""}${this.lastName[0] ?? ""}`.toUpperCase();
  }
}

export class Leaderboard {
  constructor(
    public readonly entries: LeaderboardEntry[],
    public readonly currentUserRank: number | null,
    public readonly scope: LeaderboardScope,
    public readonly period: LeaderboardPeriod,
  ) {}
}
