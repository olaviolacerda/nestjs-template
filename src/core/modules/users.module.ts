import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from '../../api/controllers/users.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../providers/services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
