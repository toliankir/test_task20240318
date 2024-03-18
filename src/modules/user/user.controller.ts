import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDtoRequest } from './dto/user-create-request.dto';
import { UserCreateDtoResponse } from './dto/user-create-response.dto';
import { UserDtoRequest } from './dto/user-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from './types/user-role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from './types/user';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async createUser(
    @Body() data: UserCreateDtoRequest,
  ): Promise<UserCreateDtoResponse> {
    if (!UserService.USER_ALLOWED_ROLES.includes(data.role)) {
      throw new BadRequestException(`Unexpcted user role ${data.role}`);
    }
    return this.userService.createUser(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('current')
  public async getCurrentUser(@GetUser() user: User) {
    return this.userService.getUser(user.id);
  }

  @Roles([UserRole.admin])
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  public async getUser(@Param() data: UserDtoRequest) {
    return this.userService.getUser(data.id);
  }

  @Get('roles')
  public getRoles(): string[] {
    return this.userService.getRoles();
  }

  @Roles([UserRole.admin])
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete()
  public async deleteUser(@Body() data: UserDtoRequest): Promise<void> {
    return this.userService.deleteUser(data.id);
  }
}
