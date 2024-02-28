import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../../src/domain/services/auth.service';
import { UsersService } from '../../../src/domain/services/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../src/domain/entities/user.entity';
import { Role } from '../../../src/common/enums/role.enum';

const mockJwtService: Partial<JwtService> = {
  sign: jest.fn().mockReturnValue('accessToken'),
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
          useValue: {},
        },
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

    expect(mockJwtService.sign).toHaveBeenCalled();
    expect(result).toEqual({ accessToken: 'accessToken' });
  });
});
