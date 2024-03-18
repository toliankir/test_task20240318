import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/modules/user/types/user-role.enum';

export const Roles = Reflector.createDecorator<UserRole[]>();
