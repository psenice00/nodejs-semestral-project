import { BlogEntity } from 'src/blogs/database/blog.entity';
import { UserEntity } from 'src/users/database/user.entity';
import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({ default: 0 })
  votes: number;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (author) => author.comments)
  author: UserEntity;

  @Column()
  authorId: string;

  @ManyToOne(() => BlogEntity, (blog) => blog.comments)
  blog: BlogEntity;

  @Column()
  blogId: string;
}
