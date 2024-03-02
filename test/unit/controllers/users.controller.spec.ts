import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersController } from '../../../src/api/controllers/users.controller';
import { UsersService } from '../../../src/core/providers/services/users.service';
import { UsersRepositoryFake, mockUser } from '../mocks/users.mock';
import { CreateUserDto } from '../../../src/common/dtos/users/create-user.dto';
import { User } from '../../../src/core/entities/user.entity';
import { Role } from '../../../src/common/enums/role.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: UsersRepositoryFake,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should list all users', async () => {
    const users = [mockUser];
    const spyFindAll = jest
      .spyOn(usersService, 'findAll')
      .mockResolvedValue(users);

    const foundUsers = await controller.findAll();

    expect(spyFindAll).toHaveBeenCalled();
    expect(foundUsers).toEqual(users);
  });

  it('should create an user with "user" role', async () => {
    const createUserDto: CreateUserDto = {
      password: mockUser.password,
      username: mockUser.username,
    };
    const spyCreate = jest
      .spyOn(usersService, 'create')
      .mockResolvedValue(mockUser);

    const createdUser = await controller.create(createUserDto);

    expect(spyCreate).toHaveBeenCalledWith(createUserDto);
    expect(createdUser).toEqual(mockUser);
    expect(createdUser.role).toBe(Role.User);
  });

  it('should create an user with "admin" role', async () => {
    const createUserDto: CreateUserDto = {
      password: mockUser.password,
      username: mockUser.username,
    };
    const mockAdminUser = {
      ...mockUser,
      role: Role.Admin,
    };
    const spyCreate = jest
      .spyOn(usersService, 'createAdminUser')
      .mockResolvedValue(mockAdminUser);

    const createdUser = await controller.createAdminUser(createUserDto);

    expect(spyCreate).toHaveBeenCalledWith(createUserDto);
    expect(createdUser.role).toBe(Role.Admin);
  });

  it.todo('should update an user');
  it.todo('should remove an user');
});
