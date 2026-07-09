import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { UserResponseDto } from '../users/dto/user.dto';
import { UserMapper } from '../users/user.mapper';
import { PaginatedUsersQueryDto } from './dto/paginated-users-query.dto';
import {
  PaginationOrderBy,
  PaginationSortBy,
} from '../shared/enums/pagination.enum';
import { PaginatedResponseDto } from '../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../shared/utils/pagination';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async findPaginated(
    query: PaginatedUsersQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );
    const sortBy = query.sortBy ?? PaginationSortBy.CREATED_AT;
    const orderBy = query.orderBy ?? PaginationOrderBy.DESC;
    const search = query.search ?? '';

    const where: Prisma.UserWhereInput = search
      ? { email: { contains: search, mode: 'insensitive' } }
      : {};

    const [users, total] = await Promise.all([
      this.adminRepository.findMany(where, { [sortBy]: orderBy }, skip, take),
      this.adminRepository.count(where),
    ]);

    return {
      data: users.map((user) => UserMapper.fromPrismaToResponse(user)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.adminRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserMapper.fromPrismaToResponse(user);
  }
}
