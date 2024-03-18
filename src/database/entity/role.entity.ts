import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;

  @Column({ name: 'role' })
  public readonly role: string;

  @Column({ name: 'utc_created_at', type: 'timestamp without time zone' })
  public readonly createdAt: Date;

  @ManyToMany(() => UserEntity, (user) => user.roles, { cascade: true })
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  public readonly users: UserEntity[];
}
