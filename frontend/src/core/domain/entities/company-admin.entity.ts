export type CompanyAdminRole = "OWNER" | "ADMIN";

export class CompanyAdmin {
  constructor(
    public readonly userId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly avatarUrl: string | null,
    public readonly headline: string | null,
    public readonly role: CompanyAdminRole,
  ) {}

  get displayName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get initials(): string {
    return `${this.firstName[0] ?? ""}${this.lastName[0] ?? ""}`.toUpperCase();
  }
}
