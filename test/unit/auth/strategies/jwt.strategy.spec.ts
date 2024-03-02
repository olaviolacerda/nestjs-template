import { Role } from '../../../../src/common/enums/role.enum';
import { JwtStrategy } from '../../../../src/core/auth/strategies/jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate a valid user', async () => {
    const payload = { id: 'id', role: Role.User };

    const response = await strategy.validate(payload);

    expect(response).toEqual(payload);
  });
});
