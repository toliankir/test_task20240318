import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsString } from 'class-validator';
import { UserRole } from '../types/user-role.enum';
import { UserService } from '../user.service';

export class UserCreateDtoRequest {
  @ApiProperty({ example: 'test@mail.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'viewer' })
  @IsIn(UserService.USER_ALLOWED_ROLES)
  role: UserRole;
}
