import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../types/user-role.enum';

export class RolesDtoResponse {
  @ApiProperty({ examples: [UserRole.admin] })
  roles: UserRole[];
}
