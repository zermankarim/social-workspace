export class CompanySummary {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly logoUrl: string | null,
    public readonly industry: string | null,
  ) {}

  get initials(): string {
    return this.name.slice(0, 2).toUpperCase();
  }
}
