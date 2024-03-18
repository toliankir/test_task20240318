import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  public readonly id: number;

  @Column({ name: 'user_id' })
  public readonly userId: number;

  @Column({ name: 'title' })
  public readonly title: string;

  @Column({ name: 'text' })
  public readonly text: string;

  @Column({ name: 'utc_created_at', type: 'timestamp without time zone' })
  public readonly createdAt: Date;

  @Column({ name: 'utc_updated_at', type: 'timestamp without time zone' })
  public readonly updatedAt: Date;

  @ManyToOne(() => UserEntity, { cascade: true })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public readonly user!: UserEntity;
}
