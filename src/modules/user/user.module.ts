import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from '../../database/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../../database/entity/role.entity';
import { UserRoleEntity } from '../../database/entity/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, UserRoleEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
