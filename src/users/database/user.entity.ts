import { BlogEntity } from 'src/blogs/database/blog.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { UserStatusEnum } from '../domain/enum/userStatus.enum';
import { UserTypeEnum } from '../domain/enum/userType.enum';
import { sanitizeEmail } from './helpers/customer-email-sanitizer';
import { CommentEntity } from 'src/comments/database/comment.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastLoginAt: Date;

  @Column('text', {
    unique: true,
    transformer: { from: sanitizeEmail, to: sanitizeEmail },
  })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.enabled,
  })
  status: UserStatusEnum;

  // default should be set to least previleged
  @Column({
    type: 'enum',
    enum: UserTypeEnum,
    default: UserTypeEnum.user,
  })
  type: UserTypeEnum;

  @OneToMany(() => BlogEntity, (blog) => blog.publisher)
  blogs?: BlogEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments?: CommentEntity[];
}
