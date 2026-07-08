import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { UserResponseDto } from '../users/dto/user.dto';
import { UserMapper } from '../users/user.mapper';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  //TODO: Add pagination
  async findAllUsers(): Promise<Array<UserResponseDto>> {
    const users = await this.adminRepository.findAllUsers();
    return users.map((user) => UserMapper.fromPrismaToResponse(user));
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.adminRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserMapper.fromPrismaToResponse(user);
  }
}
