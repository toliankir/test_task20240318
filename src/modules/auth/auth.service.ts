import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResponseDto } from './dto/login.response.dto';
import { RefreshResponseDto } from './dto/refresh.response.dto';
import { User } from '../user/types/user';
import { UserFull } from '../user/types/user-full';
import { LoginRequestDto } from './dto/login.request.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtTtl: number;
  private readonly jwtTtlRefresh: number;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    readonly configService: ConfigService,
  ) {
    this.jwtSecret = configService.get<string>('JWT_SECRET');
    if (!this.jwtSecret) {
      const errorMessage = 'JWT_SECRET must be set.';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    this.jwtRefreshSecret = configService.get<string>('JWT_REFRESH_SECRET');
    if (!this.jwtSecret) {
      const errorMessage = 'JWT_REFRESH_SECRET must be set.';
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    let jwtTtlNumber = parseInt(configService.get<string>('JWT_TTL_MINUTES'));
    if (isNaN(jwtTtlNumber)) {
      this.logger.warn(`JWT_TTL_MINUTES incorrect value. Use default value.`);
      jwtTtlNumber = 60;
    }

    let jwtTtlRefreshNumber = parseInt(
      configService.get<string>('JWT_REFRESH_TTL_MINUTES'),
    );
    if (isNaN(jwtTtlRefreshNumber)) {
      this.logger.warn(
        `JWT_REFRESH_TTL_MINUTES incorrect value. Use default value.`,
      );
      jwtTtlRefreshNumber = 43200;
    }

    this.jwtTtl = jwtTtlNumber * 60;
    this.jwtTtlRefresh = jwtTtlRefreshNumber * 60;
  }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user: UserFull | null = await this.userService.findUserByEmail(email);
    if (!user) {
      this.logger.verbose(
        `Try to login with user ${email}. User does not exist.`,
      );
      return null;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.verbose(
        `Try to login with user ${email}. Incorrect password.`,
      );
      return null;
    }

    return {
      id: user.id,
      roles: user.roles,
    };
  }

  public async login(
    user: User,
    data: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    if (!user.roles.includes(data.role)) {
      throw new BadRequestException(
        `Not allowed role "${data.role}" for user.`,
      );
    }

    const token = await this.jwtService.signAsync(
      {
        id: user.id,
        roles: [data.role],
      },
      {
        secret: this.jwtSecret,
        expiresIn: this.jwtTtl,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        id: user.id,
      },
      {
        secret: this.jwtRefreshSecret,
        expiresIn: this.jwtTtlRefresh,
      },
    );

    return {
      id: user.id,
      token,
      refreshToken,
    };
  }

  public async refreshToken(user: User): Promise<RefreshResponseDto> {
    const token = await this.jwtService.signAsync(
      {
        id: user.id,
        roles: user.roles,
      },
      {
        secret: this.jwtSecret,
        expiresIn: this.jwtTtl,
      },
    );

    return {
      id: user.id,
      token,
    };
  }
}
