import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../../../../src/core/providers/services/auth.service';
import { UsersService } from '../../../../src/core/providers/services/users.service';
import { User } from '../../../../src/core/entities/user.entity';
import { Role } from '../../../../src/common/enums/role.enum';
import { AuthHelper } from '../../../../src/core/providers/helpers/auth.helper';

const mockJwtService: Partial<JwtService> = {
  signAsync: jest.fn().mockResolvedValue('fakeJwtToken'),
};

let compareResponse = true;

jest.mock('bcrypt', () => ({
  async compare(): Promise<boolean> {
    return compareResponse;
  },
  async hashSync(): Promise<string> {
    return 'hash';
  },
}));

const mockUser: Partial<User> = {
  id: 'id',
  username: 'fake',
  role: Role.User,
  refreshToken: 'refreshToken',
  password: 'fakePass',
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let authHelper: AuthHelper;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            preload: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue(mockUser),
            findOne: jest.fn().mockResolvedValue(mockUser),
            findByUsername: jest.fn().mockResolvedValue(mockUser),
            save: jest.fn(),
          },
        },
        ConfigService,
        AuthHelper,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    authHelper = module.get<AuthHelper>(AuthHelper);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login a registered user', async () => {
    const payload = { id: mockUser.id, role: mockUser.role };
    const hashedRefreshToken = 'hashedRefreshToken';
    const spyUserUpdate = jest.spyOn(usersService, 'update');
    const spyHashToken = jest
      .spyOn(authHelper, 'hashToken')
      .mockResolvedValue(hashedRefreshToken);

    const result = await service.login(payload);

    expect(spyHashToken).toHaveBeenCalledWith('fakeJwtToken');
    expect(spyUserUpdate).toHaveBeenCalled();
    expect(spyUserUpdate).toHaveBeenCalledWith(payload.id, {
      refreshToken: hashedRefreshToken,
    });
    expect(mockJwtService.signAsync).toHaveBeenCalled();
    expect(result).toEqual({
      accessToken: 'fakeJwtToken',
      refreshToken: 'fakeJwtToken',
    });
  });

  it('should logout a logged user', async () => {
    const userId = mockUser.id;
    const spyUserServiceUpdate = jest.spyOn(usersService, 'update');

    await service.logout(userId);

    expect(spyUserServiceUpdate).toHaveBeenCalledTimes(1);
    expect(spyUserServiceUpdate).toHaveBeenCalledWith(userId, {
      refreshToken: null,
    });
  });

  it('should update refresh token', async () => {
    const payload = {
      userId: mockUser.id,
      refreshToken: mockUser.refreshToken,
    };
    const spyUserServiceUpdate = jest.spyOn(usersService, 'update');
    const hashedRefreshToken = 'hashedRefreshToken';
    const spyHashToken = jest
      .spyOn(authHelper, 'hashToken')
      .mockResolvedValue(hashedRefreshToken);

    await service.updateRefreshToken(payload.userId, payload.refreshToken);

    expect(spyHashToken).toHaveBeenCalledWith(payload.refreshToken);
    expect(spyUserServiceUpdate).toHaveBeenCalledWith(payload.userId, {
      refreshToken: hashedRefreshToken,
    });
  });

  it('should refresh token', async () => {
    const payload = { id: mockUser.id, role: mockUser.role };
    const fakeToken = 'fakeJwtToken';
    const spyGetTokens = jest.spyOn(service, 'getTokens').mockResolvedValue({
      accessToken: fakeToken,
      refreshToken: fakeToken,
    });
    const spyUpdateRefreshToken = jest.spyOn(service, 'updateRefreshToken');
    const tokens = await service.refreshTokens(payload);

    expect(spyGetTokens).toHaveBeenCalledWith(payload);
    expect(spyUpdateRefreshToken).toHaveBeenCalledWith(payload.id, fakeToken);
    expect(tokens).toEqual({
      accessToken: 'fakeJwtToken',
      refreshToken: 'fakeJwtToken',
    });
  });

  it('should get tokens', async () => {
    const payload = { id: mockUser.id, role: mockUser.role };
    const spySignAsync = jest.spyOn(jwtService, 'signAsync');
    const tokenPayload = { expiresIn: '15m', secret: 'fakeSecret' };
    const refreshTokenPayload = { expiresIn: '7d', secret: 'fakeSecret' };
    const spyGetConfig = jest
      .spyOn(configService, 'get')
      .mockReturnValue('fakeSecret');

    const tokens = await service.getTokens(payload);

    expect(spyGetConfig).toHaveBeenCalledTimes(2);
    expect(spyGetConfig).toHaveBeenNthCalledWith(1, 'JWT_SECRET');
    expect(spyGetConfig).toHaveBeenNthCalledWith(2, 'JWT_REFRESH_SECRET');
    expect(spySignAsync).toHaveBeenCalledTimes(2);
    expect(spySignAsync).toHaveBeenNthCalledWith(1, payload, tokenPayload);
    expect(spySignAsync).toHaveBeenNthCalledWith(
      2,
      payload,
      refreshTokenPayload,
    );
    expect(tokens).toEqual({
      accessToken: 'fakeJwtToken',
      refreshToken: 'fakeJwtToken',
    });
  });

  it('should validate user', async () => {
    const payload = { username: mockUser.username, pass: mockUser.password };
    const spyFindByUsername = jest.spyOn(usersService, 'findByUsername');

    const user = await service.validateUser(payload.username, payload.pass);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...mockUserFormatted } = mockUser;

    expect(spyFindByUsername).toHaveBeenCalledWith(payload.username);
    expect(user).toEqual(mockUserFormatted);
  });

  it("should NOT validate user if passwords doesn't matches", async () => {
    const payload = { username: mockUser.username, pass: mockUser.password };
    const spyFindByUsername = jest.spyOn(usersService, 'findByUsername');
    compareResponse = false;

    const user = await service.validateUser(payload.username, payload.pass);

    expect(spyFindByUsername).toHaveBeenCalledWith(payload.username);
    expect(user).toBeNull();
  });

  it('should throw if is an invalid user', async () => {
    const payload = { username: mockUser.username, pass: mockUser.password };
    const spyFindByUsername = jest
      .spyOn(usersService, 'findByUsername')
      .mockResolvedValueOnce(null);

    try {
      await service.validateUser(payload.username, payload.pass);
    } catch (error) {
      expect(spyFindByUsername).toHaveBeenCalledWith(payload.username);
      expect(error).toBeDefined();
      expect(error.message).toEqual('Something is wrong with your credentials');
    }
  });
});
