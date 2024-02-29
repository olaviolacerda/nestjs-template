import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateUserDto } from '../../common/dtos/users/create-user.dto';
import { UpdateUserDto } from '../../common/dtos/users/update-user.dto';
import { Role } from '../../common/enums/role.enum';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  prepareUserResponse(user: User): Partial<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, hashPassword, ...response } = user;
    return response;
  }

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const user = await this.findByUsername(createUserDto.username);

    if (user) {
      throw new BadRequestException();
    }

    const createdUser = await this.usersRepository.create(createUserDto);
    const savedUser = await this.usersRepository.save(createdUser);
    return this.prepareUserResponse(savedUser);
  }

  async createAdminUser(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.findByUsername(createUserDto.username);

    if (user) {
      throw new BadRequestException();
    }

    const createdUser = await this.usersRepository.create(createUserDto);
    createdUser.role = Role.Admin;

    const savedUser = await this.usersRepository.save(createdUser);

    return this.prepareUserResponse(savedUser);
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

  async update(id: User['id'], updateUserDto: Partial<UpdateUserDto>) {
    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    return this.usersRepository.save(user);
  }

  async remove(id: User['id']) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    return this.usersRepository.remove(user);
  }
}
