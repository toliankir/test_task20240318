import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserWithRole } from '../../../modules/user/types/user-with-role';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserWithRole => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
