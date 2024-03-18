import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from '../decorators/role.decorator';
import { UserRole } from 'src/modules/user/types/user-role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: UserRole[] = this.reflector.get(Roles, context.getHandler());
    if (roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    return true;
  }
}
