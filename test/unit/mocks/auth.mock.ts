import { JwtService } from '@nestjs/jwt';

export const mockTokens = {
  accessToken: 'fakeJwtToken',
  refreshToken: 'fakeJwtToken',
};

export const mockJwtService: Partial<JwtService> = {
  signAsync: jest.fn().mockResolvedValue('fakeJwtToken'),
};
