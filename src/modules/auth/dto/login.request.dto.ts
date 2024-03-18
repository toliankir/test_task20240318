import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from 'src/modules/user/types/user-role.enum';

export class LoginRequestDto {
  @ApiProperty({ example: 'test@mail.com', required: true })
  @IsEmail()
  @IsString()
  username: string;

  @ApiProperty({ example: 'weakpassword', required: true })
  @IsString()
  password: string;

  @ApiProperty({ example: 'editor', required: true })
  @IsEnum(UserRole)
  role: UserRole;
}
