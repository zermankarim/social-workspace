import type { UserResponseDto } from "@/infrastructure/api/dto/auth-response.dto";
import type { PaginationMetaResponseDto } from "@/infrastructure/api/dto/pagination-response.dto";

export interface PaginatedUsersResponseDto {
  data: UserResponseDto[];
  meta: PaginationMetaResponseDto;
}
