import type { FollowUser } from "@/core/domain/entities/follow-user.entity";

export class Follow {
  constructor(
    public readonly id: string,
    public readonly follower: FollowUser,
    public readonly following: FollowUser,
    public readonly createdAt: Date,
  ) {}
}
