import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/domain/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from '../../../src/auth/strategies/local.strategy';
import { JwtStrategy } from '../../../src/auth/strategies/jwt.strategy';
import { UsersModule } from '../../../src/infra/modules/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: 'my_secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [AuthService, JwtService, LocalStrategy, JwtStrategy],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
