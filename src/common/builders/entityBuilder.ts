import { BlogEntity } from 'src/blogs/database/blog.entity';
import { CommentEntity } from 'src/comments/database/comment.entity';
import { UserEntity } from 'src/users/database/user.entity';
import { UserStatusEnum } from 'src/users/domain/enum/userStatus.enum';
import { UserTypeEnum } from 'src/users/domain/enum/userType.enum';
import { v4 } from 'uuid';

export class EntityBuilder {
  static getUserEntity(data?: Partial<UserEntity>): UserEntity {
    const entity = new UserEntity();
    entity.id = v4();
    entity.createdAt = new Date();
    entity.email = 'john.doe@email.com';
    entity.firstName = 'John';
    entity.lastName = 'Doe';
    entity.password = 'password';
    entity.status = UserStatusEnum.enabled;
    entity.type = UserTypeEnum.user;
    return Object.assign(entity, data);
  }

  static getBlogEntity(data?: Partial<BlogEntity>): BlogEntity {
    const entity = new BlogEntity();
    entity.id = v4();
    entity.title = 'Blog Title';
    entity.text = 'Blog Content';
    entity.imageUrl = 'https://picsum.photos/200/300';
    return Object.assign(entity, data);
  }

  static getCommentEntity(data?: Partial<CommentEntity>): CommentEntity {
    const entity = new CommentEntity();
    entity.id = v4();
    entity.text = 'Blog Content';
    entity.votes = 0;
    return Object.assign(entity, data);
  }
}
