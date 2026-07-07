import { ProfileRole } from "@/core/domain/enums/profile-role.enum";

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly role: ProfileRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isAdmin(): boolean {
    return this.role === ProfileRole.ADMIN;
  }
}
