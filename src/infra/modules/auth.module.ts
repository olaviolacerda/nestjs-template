import { Module } from '@nestjs/common';
import { AuthService } from '../../domain/services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../common/constants';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';
import { UsersModule } from './users.module';
import { LocalStrategy } from '../../auth/strategies/local.strategy';
import { AuthController } from 'src/api/controllers/auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '360s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
