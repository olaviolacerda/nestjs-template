import { JwtRefreshStrategy } from './../auth/strategies/jwt-refresh.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users.module';
import { AuthController } from '../../api/controllers/auth.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { LocalStrategy } from '../auth/strategies/local.strategy';
import { ConfigService } from '@nestjs/config';

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
