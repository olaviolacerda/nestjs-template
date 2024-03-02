import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as httpMock from 'node-mocks-http';

import { AuthController } from '../../../src/api/controllers/auth.controller';
import { UsersService } from '../../../src/core/providers/services/users.service';
import { AuthService } from './../../../src/core/providers/services/auth.service';
import { UsersRepositoryFake, mockUser } from '../mocks/users.mock';
import { User } from '../../../src/core/entities/user.entity';
import { AuthHelper } from '../../../src/core/providers/helpers/auth.helper';
import { mockTokens } from '../mocks/auth.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: UsersRepositoryFake,
        },
        AuthService,
        JwtService,
        ConfigService,
        AuthHelper,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login an user', async () => {
    const req = httpMock.createRequest();
    req.user = { id: mockUser.id, role: mockUser.role };

    const spyLogin = jest
      .spyOn(authService, 'login')
      .mockResolvedValue(mockTokens);

    const tokens = await controller.login(req);

    expect(spyLogin).toHaveBeenCalledWith(req.user);
    expect(tokens).toEqual(mockTokens);
  });

  it('should logout a registered user', async () => {
    const req = httpMock.createRequest();
    req.user = { id: mockUser.id, role: mockUser.role };

    const spyLogout = jest
      .spyOn(authService, 'logout')
      .mockResolvedValue(mockUser);

    const updatedUser = await controller.logout(req);

    expect(spyLogout).toHaveBeenCalledWith(req.user['id']);
    expect(updatedUser).toEqual(mockUser);
  });

  it('should refresh tokens', async () => {
    const req = httpMock.createRequest();
    req.user = { id: mockUser.id, role: mockUser.role };

    const spyRefresh = jest
      .spyOn(authService, 'refreshTokens')
      .mockResolvedValue(mockTokens);

    const tokens = await controller.refreshTokens(req);

    expect(spyRefresh).toHaveBeenCalledWith(req.user);
    expect(tokens).toEqual(mockTokens);
  });
});
