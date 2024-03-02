import * as httpMock from 'node-mocks-http';

import { Role } from '../../../../src/common/enums/role.enum';
import { JwtRefreshStrategy } from '../../../../src/core/auth/strategies/jwt-refresh.strategy';

describe('JwtRefreshStrategy', () => {
  let strategy: JwtRefreshStrategy;

  beforeEach(() => {
    strategy = new JwtRefreshStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate a valid user', async () => {
    const payload = { id: 'id', role: Role.User };
    const req = httpMock.createRequest();
    req.headers.authorization = 'Bearer fakeJwtToken';

    const response = await strategy.validate(req, payload);

    expect(response).toEqual({ refreshToken: 'fakeJwtToken', ...payload });
  });
});
