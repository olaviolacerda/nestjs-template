import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateUserDto } from '../../../common/dtos/users/create-user.dto';
import { UpdateUserDto } from '../../../common/dtos/users/update-user.dto';
import { Role } from '../../../common/enums/role.enum';
import { User } from '../../../common/interfaces/users.interface';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<User>,
  ) {}

  private prepareUserResponse(user: User): Partial<User> {
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

  async createAdminUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
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

  async update(
    id: User['id'],
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<Partial<User>> {
    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    const savedUser = await this.usersRepository.save(user);
    return this.prepareUserResponse(savedUser);
  }

  async remove(id: User['id']): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }

    return this.usersRepository.remove(user);
  }
}
