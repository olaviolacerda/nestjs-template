import { createMock } from '@golevelup/ts-jest';

import { LocalStrategy } from '../../../../src/core/auth/strategies/local.strategy';
import { AuthService } from '../../../../src/core/providers/services/auth.service';
import { mockUser } from '../../mocks/users.mock';

describe('LocalStrategy', () => {
  let authService: AuthService;
  let strategy: LocalStrategy;

  beforeEach(() => {
    authService = createMock<AuthService>();
    strategy = new LocalStrategy(authService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate a valid user', async () => {
    const credentials = { username: 'username', password: 'password' };
    const spyValidateUser = jest
      .spyOn(authService, 'validateUser')
      .mockResolvedValue(mockUser);

    const user = await strategy.validate(
      credentials.username,
      credentials.password,
    );

    expect(spyValidateUser).toHaveBeenCalled();
    expect(user).toEqual(mockUser);
  });

  it('should throw if an invalid user is provided', async () => {
    const credentials = { username: 'username', password: 'password' };
    const spyValidateUser = jest
      .spyOn(authService, 'validateUser')
      .mockResolvedValue(null);

    try {
      await strategy.validate(credentials.username, credentials.password);
    } catch (error) {
      expect(spyValidateUser).toHaveBeenCalled();
      expect(error).toBeDefined();
      expect(error.message).toBe('Unauthorized');
    }
  });
});
