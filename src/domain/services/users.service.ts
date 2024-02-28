import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/infra/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from 'src/infra/dtos/users.dto';
import { Role } from 'src/common/enums/role.enum';
import { Repository } from 'typeorm';

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

    const savedUser = await this.usersRepository.save(createUserDto);
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

  async update(id: User['id'], updateUserDto: UpdateUserDto) {
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
