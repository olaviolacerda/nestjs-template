import { Module } from '@nestjs/common';
import { UsersService } from '../../domain/services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../../auth/strategies/jwt.strategy';
import { User } from '../entities/user.entity';
import { UsersController } from 'src/api/controllers/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
