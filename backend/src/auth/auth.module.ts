import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';
import { SessionService } from './services/session.service';
import { RolesGuard } from './guards/roles.guard';
import { SessionRepository } from './repositories/session.repository';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    SessionService,
    RolesGuard,
    SessionRepository,
  ],
  exports: [JwtAuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
