import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from '../../../../src/core/providers/services/users.service';
import { UserEntity } from '../../../../src/core/entities/user.entity';
import { Role } from '../../../../src/common/enums/role.enum';
import { CreateUserDto } from '../../../../src/common/dtos/users/create-user.dto';
import { UpdateUserDto } from '../../../../src/common/dtos/users/update-user.dto';
import { UsersRepositoryFake, mockUser } from '../../../mocks/users.mock';
import { User } from '../../../../src/common/interfaces/users.interface';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepositoryFake;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: UsersRepositoryFake,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepositoryFake>(
      getRepositoryToken(UserEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an user with default "user" role', async () => {
    const createUser: CreateUserDto = {
      username: mockUser.username,
      password: mockUser.password,
    };

    const spyFindOne = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(null);
    const spyCreate = jest
      .spyOn(repository, 'create')
      .mockResolvedValue(mockUser);
    const spySave = jest.spyOn(repository, 'save').mockResolvedValue(mockUser);
    const spyFindByUserName = jest.spyOn(service, 'findByUsername');

    const createdUser = await service.create(createUser);

    expect(spyFindByUserName).toHaveBeenCalledWith(createUser.username);
    expect(spyFindOne).toHaveBeenCalled();
    expect(spyCreate).toHaveBeenCalled();
    expect(spySave).toHaveBeenCalled();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, hashPassword, ...response } = mockUser;
    expect(createdUser).toEqual(response);
    expect(createdUser.role).toEqual(Role.User);
  });

  it('should create an user with "admin" role', async () => {
    const createUser: CreateUserDto = {
      username: mockUser.username,
      password: mockUser.password,
    };

    const spyCreate = jest
      .spyOn(repository, 'create')
      .mockResolvedValue(mockUser);
    const spySave = jest.spyOn(repository, 'save').mockResolvedValue(mockUser);
    const spyFindByUserName = jest
      .spyOn(service, 'findByUsername')
      .mockResolvedValue(null);

    const createdUser = await service.createAdminUser(createUser);

    expect(spyFindByUserName).toHaveBeenCalledWith(createUser.username);
    expect(spyCreate).toHaveBeenCalled();
    expect(spySave).toHaveBeenCalled();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, hashPassword, ...response } = mockUser;
    expect(createdUser).toEqual(response);
    expect(createdUser.role).toEqual(Role.Admin);
  });

  it('should NOT create an user if it exists', async () => {
    const createUser: CreateUserDto = {
      username: mockUser.username,
      password: mockUser.password,
    };
    const spyFindByUsername = jest
      .spyOn(service, 'findByUsername')
      .mockResolvedValue(mockUser);
    const spyCreate = jest.spyOn(repository, 'create');
    const spySave = jest.spyOn(repository, 'save');

    try {
      await service.create(createUser);
    } catch (error) {
      expect(spyFindByUsername).toHaveBeenCalledWith(createUser.username);
      expect(spyCreate).not.toHaveBeenCalled();
      expect(spySave).not.toHaveBeenCalled();
      expect(error).toBeDefined();
    }
  });

  it('should NOT create an "admin" user if it exists', async () => {
    const createUser: CreateUserDto = {
      username: mockUser.username,
      password: mockUser.password,
    };
    const spyFindByUsername = jest
      .spyOn(service, 'findByUsername')
      .mockResolvedValue(mockUser);
    const spyCreate = jest.spyOn(repository, 'create');
    const spySave = jest.spyOn(repository, 'save');

    try {
      await service.createAdminUser(createUser);
    } catch (error) {
      expect(spyFindByUsername).toHaveBeenCalledWith(createUser.username);
      expect(spyCreate).not.toHaveBeenCalled();
      expect(spySave).not.toHaveBeenCalled();
      expect(error).toBeDefined();
    }
  });

  it('should find user by username', async () => {
    const username = mockUser.username;

    const spyFindOne = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(mockUser);

    const foundUser = await service.findByUsername(username);

    expect(spyFindOne).toHaveBeenCalledWith({
      select: ['id', 'password', 'role'],
      where: { username },
    });
    expect(foundUser).toEqual(mockUser);
  });

  it('should find all users', async () => {
    const spyFind = jest
      .spyOn(repository, 'find')
      .mockResolvedValue([mockUser]);

    const foundUsers = await service.findAll();

    expect(spyFind).toHaveBeenCalled();
    expect(foundUsers).toEqual([mockUser]);
  });

  it('should update an existing user', async () => {
    const userId = mockUser.id;
    const updateUserDto: Partial<UpdateUserDto> = {
      refreshToken: 'newRefeshToken',
      username: 'newUsername',
    };
    const mockPreloadedUser = {
      ...mockUser,
      ...updateUserDto,
    } as User;

    const spyPreload = jest
      .spyOn(repository, 'preload')
      .mockResolvedValue(mockPreloadedUser);
    const spySave = jest
      .spyOn(repository, 'save')
      .mockResolvedValue(mockPreloadedUser);

    const updatedUser = await service.update(userId, updateUserDto);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, hashPassword, ...response } = updatedUser;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, hashPassword: hp, ...expected } = mockPreloadedUser;

    expect(spyPreload).toHaveBeenCalledWith({ id: userId, ...updateUserDto });
    expect(spySave).toHaveBeenCalledWith(mockPreloadedUser);
    expect(response).toEqual(expected);
  });

  it("should NOT update an user if it doesn't exists", async () => {
    const userId = mockUser.id;
    const updateUserDto: Partial<UpdateUserDto> = {
      refreshToken: 'newRefeshToken',
      username: 'newUsername',
    };

    const spyPreload = jest
      .spyOn(repository, 'preload')
      .mockResolvedValue(null);
    const spySave = jest.spyOn(repository, 'save');

    try {
      await service.update(userId, updateUserDto);
    } catch (error) {
      expect(spyPreload).toHaveBeenCalledWith({ id: userId, ...updateUserDto });
      expect(spySave).not.toHaveBeenCalled();
      expect(error).toBeDefined();
      expect(error.message).toBe(`User not found: ${userId}`);
    }
  });

  it('should remove an existing user', async () => {
    const userId = mockUser.id;

    const spyFindOne = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(mockUser);
    const spyRemove = jest.spyOn(repository, 'remove');

    await service.remove(userId);
    expect(spyFindOne).toHaveBeenCalledWith({ where: { id: userId } });
    expect(spyRemove).toHaveBeenCalledWith(mockUser);
  });

  it("should NOT remove an user if it doesn't exists", async () => {
    const userId = mockUser.id;

    const spyFindOne = jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(null);
    const spyRemove = jest.spyOn(repository, 'remove');

    try {
      await service.remove(userId);
    } catch (error) {
      expect(spyFindOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(spyRemove).not.toHaveBeenCalled();
      expect(error).toBeDefined();
      expect(error.message).toBe(`User not found: ${userId}`);
    }
  });
});
