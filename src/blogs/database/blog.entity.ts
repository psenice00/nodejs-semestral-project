import { CommentEntity } from 'src/comments/database/comment.entity';
import { UserEntity } from 'src/users/database/user.entity';
import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BlogEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column({ nullable: true })
  imageUrl: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => UserEntity, (publisher) => publisher.blogs)
  publisher: UserEntity;

  @Column()
  publisherId: string;

  @OneToMany(() => CommentEntity, (comment) => comment.blog)
  comments?: CommentEntity[];
}
