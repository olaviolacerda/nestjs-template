import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createMock } from '@golevelup/ts-jest';

import { RolesGuard } from '../../../../src/core/auth/guards/roles.guard';
import { Role } from '../../../../src/common/enums/role.enum';

describe('RoleGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if there are no required roles', () => {
    const mockExecutionContext = createMock<ExecutionContext>();

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

    const canActivate = guard.canActivate(mockExecutionContext);
    expect(canActivate).toBeTruthy();
  });

  it('should return true if user have some of the required roles', () => {
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            role: Role.Admin,
          },
        }),
      }),
    });

    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Role.Admin, Role.User]);

    const canActivate = guard.canActivate(mockExecutionContext);
    expect(canActivate).toBeTruthy();
  });

  it('should return false if user have some of the required roles', () => {
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            role: 'fakeRole',
          },
        }),
      }),
    });

    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Role.Admin, Role.User]);

    const canActivate = guard.canActivate(mockExecutionContext);
    expect(canActivate).toBeFalsy();
  });
});
