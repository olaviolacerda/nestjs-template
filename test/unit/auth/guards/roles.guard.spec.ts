import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../../../src/core/auth/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { buildExecutionContextMock } from '../../mocks/guards.mock';

describe('RoleGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let context: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
    context = buildExecutionContextMock();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if there are no required roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

    const canActivate = guard.canActivate(context);
    expect(canActivate).toBeTruthy();
  });

  it('should return true if user have some of the required roles', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Role.Admin, Role.User]);

    context.switchToHttp = jest.fn().mockImplementation(() => ({
      getRequest: () => ({
        user: {
          role: Role.User,
        },
      }),
    }));

    const canActivate = guard.canActivate(context);
    expect(canActivate).toBeTruthy();
  });

  it('should return false if user have some of the required roles', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([Role.Admin, Role.User]);

    context.switchToHttp = jest.fn().mockImplementation(() => ({
      getRequest: () => ({
        user: {
          role: 'fakeRole',
        },
      }),
    }));

    const canActivate = guard.canActivate(context);
    expect(canActivate).toBeFalsy();
  });
});
