import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';

@Entity('user_role')
export class UserRoleEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;

  @Column({ name: 'user_id' })
  public readonly userId: number;

  @Column({ name: 'role_id' })
  public readonly roleId: number;

  @Column({ name: 'utc_created_at', type: 'timestamp without time zone' })
  public readonly createdAt: Date;

  @ManyToOne(() => UserEntity, { cascade: true })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public readonly user: UserEntity;

  @ManyToOne(() => RoleEntity, { cascade: true })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  public readonly role: RoleEntity;
}
