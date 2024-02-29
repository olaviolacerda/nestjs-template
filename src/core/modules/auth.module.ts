import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from '../../api/controllers/auth.controller';
import { JwtRefreshStrategy } from '../auth/strategies/jwt-refresh.strategy';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { LocalStrategy } from '../auth/strategies/local.strategy';
import { AuthService } from '../services/auth.service';
import { UsersModule } from './users.module';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    LocalStrategy,
    ConfigService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
