import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ObjectType,
  ManyToMany,
} from 'typeorm';
import { UserRoleEntity } from './user-role.entity';
import { ArticleEntity } from './article.entity';
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;

  @Column({ name: 'email' })
  public readonly email: string;

  @Column({ name: 'password' })
  public readonly password: string;

  @Column({ name: 'utc_created_at', type: 'timestamp without time zone' })
  public readonly createdAt: Date;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  public readonly roles: RoleEntity[];

  @OneToMany(
    (): ObjectType<ArticleEntity> => ArticleEntity,
    ({ user }: ArticleEntity): UserEntity => user,
  )
  public readonly articles: ArticleEntity[];
}
