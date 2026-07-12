import type { Location } from "@/core/domain/entities/location.entity";
import { PreferredLocale } from "@/core/domain/enums/preferred-locale.enum";
import { ProfileRole } from "@/core/domain/enums/profile-role.enum";

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly role: ProfileRole,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly headline: string | null,
    public readonly bio: string | null,
    public readonly location: Location | null,
    public readonly avatarUrl: string | null,
    public readonly coverUrl: string | null,
    public readonly preferredLocale: PreferredLocale,
    public readonly github: string | null,
    public readonly linkedin: string | null,
    public readonly website: string | null,
    public readonly twitter: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get displayName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get initials(): string {
    const fromName = `${this.firstName[0] ?? ""}${this.lastName[0] ?? ""}`;
    return fromName.trim().toUpperCase() || "?";
  }

  isAdmin(): boolean {
    return this.role === ProfileRole.ADMIN;
  }
}
