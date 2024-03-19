import { ConflictException, Injectable } from '@nestjs/common';
import { UserEntity } from '../../database/entity/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDtoRequest } from './dto/user-create-request.dto';
import * as bcrypt from 'bcrypt';
import { UserActionDtoResponse } from './dto/user-action-response.dto';
import { RoleEntity } from 'src/database/entity/role.entity';
import { UserRoleEntity } from 'src/database/entity/user-role.entity';
import { UserRole } from './types/user-role.enum';
import { UserFull } from './types/user-full';
import { UserDtoResponse } from './dto/user-response.dto';

@Injectable()
export class UserService {
  public static USER_ALLOWED_ROLES = [UserRole.editor, UserRole.viewer];
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
  ) { }

  public async getUser(id: number): Promise<UserDtoResponse> {
    const user: UserEntity = await this.userRepository.findOneOrFail({
      where: { id },
      relations: ['roles'],
    });

    return UserDtoResponse.fromEntity(user);
  }

  public async getUsers(): Promise<UserDtoResponse[]> {
    const users: UserEntity[] = await this.userRepository.find({
      relations: ['roles'],
      order: {
        id: 'ASC',
      },
    });

    return users.map((e) => UserDtoResponse.fromEntity(e));
  }

  public getRoles(): UserRole[] {
    return UserService.USER_ALLOWED_ROLES;
  }

  public async createUser(
    userData: UserCreateDtoRequest,
  ): Promise<UserActionDtoResponse> {
    const existingRoleEntity: RoleEntity =
      await this.roleRepository.findOneOrFail({
        where: { role: userData.role },
      });

    const existingUserEntity: UserEntity | null =
      await this.userRepository.findOne({
        where: { email: userData.email },
      });

    if (existingUserEntity) {
      throw new ConflictException(
        `User with ${userData.email} email already exist`,
      );
    }

    const hasedPassword = await bcrypt.hash(userData.password, 10);

    const newUserEntity: DeepPartial<UserEntity> = {
      email: userData.email,
      password: hasedPassword,
    };

    const createdUser = await this.userRepository.save(newUserEntity);

    const newUserRoleEntity: DeepPartial<UserRoleEntity> = {
      userId: createdUser.id,
      roleId: existingRoleEntity.id,
    };

    await this.userRoleRepository.save(newUserRoleEntity);

    return {
      id: createdUser.id,
    };
  }

  public async deleteUser(id: number): Promise<boolean> {
    const deleteResult = await this.userRepository.delete({ id });
    return deleteResult.affected > 0;
  }

  public async findUserByEmail(email: string): Promise<UserFull> {
    const user: UserEntity = await this.userRepository.findOneOrFail({
      where: { email },
      relations: ['roles'],
    });

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      roles: user.roles.map((e) => e.role as UserRole),
    };
  }

  public async findUserById(id: number): Promise<UserFull> {
    const user: UserEntity = await this.userRepository.findOneOrFail({
      where: { id },
      relations: ['roles'],
    });

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      roles: user.roles.map((e) => e.role as UserRole),
    };
  }
}
