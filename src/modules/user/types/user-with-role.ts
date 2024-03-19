import { UserRole } from './user-role.enum';

export interface UserWithRole {
  id: number;
  roles: UserRole[];
  selectedRole: UserRole;
}
