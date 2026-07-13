import type { Education } from "@/core/domain/entities/education.entity";
import type { Location } from "@/core/domain/entities/location.entity";
import type { Skill } from "@/core/domain/entities/skill.entity";
import type { UserLanguage } from "@/core/domain/entities/user-language.entity";
import type { WorkExperience } from "@/core/domain/entities/work-experience.entity";
import { PreferredLocale } from "@/core/domain/enums/preferred-locale.enum";
import { ProfileRole } from "@/core/domain/enums/profile-role.enum";

export class UserProfile {
  constructor(
    public readonly id: string,
    public readonly email: string | null,
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
    public readonly experiences: WorkExperience[],
    public readonly educations: Education[],
    public readonly languages: UserLanguage[],
    public readonly skills: Skill[],
    public readonly connectionsCount: number,
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

  isOwnedBy(userId: string): boolean {
    return this.id === userId;
  }
}
