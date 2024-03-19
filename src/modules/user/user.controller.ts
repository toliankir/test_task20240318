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
import { UserActionDtoResponse } from './dto/user-action-response.dto';
import { UserDtoRequest } from './dto/user-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from './types/user-role.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from './types/user';
import { UserDtoResponse } from './dto/user-response.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { RolesDtoResponse } from './dto/roles-response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiResponse({ type: [UserDtoResponse] })
  @Roles([UserRole.admin])
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  public async getUsers(): Promise<UserDtoResponse[]> {
    return this.userService.getUsers();
  }

  @ApiBody({ type: UserCreateDtoRequest })
  @ApiResponse({ type: UserActionDtoResponse })
  @Post()
  public async createUser(
    @Body() data: UserCreateDtoRequest,
  ): Promise<UserActionDtoResponse> {
    if (!UserService.USER_ALLOWED_ROLES.includes(data.role)) {
      throw new BadRequestException(`Unexpcted user role ${data.role}`);
    }
    return this.userService.createUser(data);
  }

  @ApiResponse({ type: RolesDtoResponse })
  @Get('available-roles')
  public getRoles(): RolesDtoResponse {
    return { roles: this.userService.getRoles() };
  }

  @ApiResponse({ type: UserDtoResponse })
  @UseGuards(AuthGuard('jwt'))
  @Get('current')
  public async getCurrentUser(@GetUser() user: User): Promise<UserDtoResponse> {
    return this.userService.getUser(user.id);
  }

  @ApiResponse({ type: UserDtoResponse })
  @Roles([UserRole.admin])
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  public async getUser(
    @Param() data: UserDtoRequest,
  ): Promise<UserDtoResponse> {
    return this.userService.getUser(data.id);
  }

  @Roles([UserRole.admin])
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete()
  public async deleteUser(
    @Body() data: UserDtoRequest,
  ): Promise<UserActionDtoResponse> {
    const deleted = await this.userService.deleteUser(data.id);
    return {
      id: deleted ? data.id : null,
    };
  }
}
