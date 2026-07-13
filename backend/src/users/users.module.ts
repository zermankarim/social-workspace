import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import {
  CatalogController,
  UsersController,
} from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';
import { AuthModule } from '../auth/auth.module';
import { ConnectionsModule } from '../connections/connections.module';

@Module({
  imports: [AuthModule, ConnectionsModule],
  controllers: [UsersController, CatalogController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
