export interface FollowUserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  headline: string | null;
  avatarUrl: string | null;
}

export interface FollowResponseDto {
  id: string;
  follower: FollowUserResponseDto;
  following: FollowUserResponseDto;
  createdAt: string;
}

export interface PaginatedFollowsResponseDto {
  data: FollowResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface FollowCountsResponseDto {
  followersCount: number;
  followingCount: number;
}

export interface FollowStatusResponseDto {
  isFollowing: boolean;
}
