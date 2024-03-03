import { JwtService } from '@nestjs/jwt';

import { Tokens } from '../../src/common/interfaces/auth.interface';

export const mockTokens: Tokens = {
  accessToken: 'fakeJwtToken',
  refreshToken: 'fakeJwtToken',
};

export const mockJwtService: Partial<JwtService> = {
  signAsync: jest.fn().mockResolvedValue('fakeJwtToken'),
};
