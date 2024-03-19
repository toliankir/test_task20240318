import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../modules/user/types/user-role.enum';

export const Roles = Reflector.createDecorator<UserRole[]>();
