import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../database/entity/user.entity';
import { UserRole } from '../types/user-role.enum';

export class UserDtoResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'test@mail.com' })
  email: string;

  @ApiProperty({ examples: [UserRole.admin] })
  roles: UserRole[];

  public static fromEntity(entity: UserEntity): UserDtoResponse {
    return {
      id: entity.id,
      email: entity.email,
      roles: entity.roles.map((e) => e.role as UserRole),
    };
  }
}
