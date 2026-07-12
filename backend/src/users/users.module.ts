import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import {
  CatalogController,
  UsersController,
} from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController, CatalogController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
