import { AuthHelper } from '../../../../src/core/providers/helpers/auth.helper';

jest.mock('bcrypt', () => ({
  async hashSync(): Promise<string> {
    return 'hash';
  },
}));

jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn(),
  }),
}));

describe('AuthHelper', () => {
  let helper: AuthHelper;

  beforeEach(async () => {
    helper = new AuthHelper();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(helper).toBeDefined();
  });

  it('should hash token', async () => {
    const refreshToken = 'refreshToken';
    const hashedToken = await helper.hashToken(refreshToken);

    expect(hashedToken).toBe('hash');
  });
});
