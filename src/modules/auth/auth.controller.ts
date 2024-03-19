import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login.request.dto';
import { GetUser } from './decorators/user.decorator';
import { LoginResponseDto } from './dto/login.response.dto';
import { RefreshResponseDto } from './dto/refresh.response.dto';
import { User } from '../user/types/user';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ type: LoginResponseDto })
  @ApiBody({ type: LoginRequestDto })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @GetUser() user: User,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() data: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(user);
  }

  @ApiResponse({ type: RefreshResponseDto })
  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  async refresh(@GetUser() user: User): Promise<RefreshResponseDto> {
    return this.authService.refreshToken(user);
  }
}
