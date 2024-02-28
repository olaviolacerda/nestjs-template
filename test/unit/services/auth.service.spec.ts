import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/domain/services/auth.service';
import { UsersService } from 'src/domain/services/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/infra/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'mysecrettest',
          signOptions: { expiresIn: '360s' },
        }),
      ],
      providers: [
        AuthService,
        JwtService,
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
});
