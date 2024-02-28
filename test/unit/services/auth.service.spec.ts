import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../../src/core/services/auth.service';
import { UsersService } from '../../../src/core/services/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../src/core/entities/user.entity';
import { Role } from '../../../src/common/enums/role.enum';
import { ConfigService } from '@nestjs/config';

const mockJwtService: Partial<JwtService> = {
  signAsync: jest.fn().mockResolvedValue('someValue'),
};

const mockUser: Partial<User> = {
  id: 'id',
  username: 'fake',
  role: Role.User,
  refreshToken: 'refreshToken',
};

describe('AuthService', () => {
  let service: AuthService;

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
            save: jest.fn(),
          },
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login registered user', async () => {
    const payload = { id: 'testId', role: Role.User };
    const result = await service.login(payload);

    expect(mockJwtService.signAsync).toHaveBeenCalled();
    expect(result).toEqual({
      accessToken: 'someValue',
      refreshToken: 'someValue',
    });
  });
});
