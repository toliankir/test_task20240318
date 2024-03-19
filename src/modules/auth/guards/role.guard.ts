import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from '../decorators/role.decorator';
import { UserRole } from 'src/modules/user/types/user-role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly logger = new Logger(RoleGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: UserRole[] = this.reflector.get(
      Roles,
      context.getHandler(),
    );
    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    let userSelectedRole = request.headers['user-role'];
    if (!userSelectedRole) {
      const userAvailableRoles = (request.user?.roles || []) as UserRole[];
      if (userAvailableRoles.length === 0) {
        this.logger.warn(`User does not have related roles`);
        return false;
      }
      userSelectedRole = userAvailableRoles[0];
      this.logger.warn(
        `Undefined user role, use first from related to user "${userSelectedRole}"`,
      );
    } else {
      const availableUserRoles = Object.values(UserRole);
      if (!availableUserRoles.includes(userSelectedRole)) {
        this.logger.warn(`Unexpected user role "${userSelectedRole}"`);
        return false;
      }
    }

    return requiredRoles.includes(userSelectedRole);
  }
}
