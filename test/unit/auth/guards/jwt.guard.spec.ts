import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../../../../src/core/auth/guards/jwt.guard';
import * as jwt from 'jsonwebtoken';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return user if no error', () => {
    const user = guard.handleRequest(null, { id: 'fakeId' }, null);

    expect(user).toBeDefined();
    expect(user).toEqual({ id: 'fakeId' });
  });

  it('should throw if token is expired', () => {
    const HTTP_STATUS_TOKEN_EXPIRED = 498;
    const tokenExpiredError = new jwt.TokenExpiredError(
      'any message',
      new Date(),
    );

    try {
      guard.handleRequest(null, {}, tokenExpiredError);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe('Token expired');
      expect(error.status).toBe(HTTP_STATUS_TOKEN_EXPIRED);
    }
  });

  it('should throw if error', () => {
    const HTTP_STATUS_UNAUTHORIZED = 401;
    try {
      guard.handleRequest(new Error(), {}, {});
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe('Http Exception');
      expect(error.response.error).toBe('Unauthorized user');
      expect(error.status).toBe(HTTP_STATUS_UNAUTHORIZED);
    }
  });

  it('should throw if user not exists', () => {
    const HTTP_STATUS_UNAUTHORIZED = 401;
    try {
      guard.handleRequest(null, null, {});
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe('Http Exception');
      expect(error.response.error).toBe('Unauthorized user');
      expect(error.status).toBe(HTTP_STATUS_UNAUTHORIZED);
    }
  });
});
