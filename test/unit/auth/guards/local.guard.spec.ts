import { Reflector } from '@nestjs/core';
import { LocalAuthGuard } from '../../../../src/core/auth/guards/local.guard';

describe('LocalAuthGuard', () => {
  let guard: LocalAuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new LocalAuthGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
