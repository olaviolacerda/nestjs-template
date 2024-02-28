import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/infra/entities/user.entity';

import { UsersRepository } from 'src/infra/repositories/users.repository';
import { CreateUserDto } from 'src/infra/dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findByUsername(username: User['username']): Promise<User> {
    return this.usersRepository.findOne({
      select: ['id', 'password', 'role'],
      where: { username },
    });
  }

  findAll() {
    return this.usersRepository.find();
  }
}
