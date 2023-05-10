import { Blog } from 'src/blogs/domain/blog';
import { Comment } from 'src/comments/domain/comment';
import { UserStatusEnum } from 'src/users/domain/enum/userStatus.enum';
import { UserTypeEnum } from 'src/users/domain/enum/userType.enum';
import { User } from 'src/users/domain/user';
import { v4 } from 'uuid';

export class DomainBuilder {
  static getUser(data?: Partial<User>): User {
    const entity = new User();
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

  static getBlog(data?: Partial<Blog>): Blog {
    const entity = new Blog();
    entity.id = v4();
    entity.title = 'Blog Title';
    entity.text = 'Blog Content';
    entity.imageUrl = 'https://picsum.photos/200/300';
    return Object.assign(entity, data);
  }

  static getComment(data?: Partial<Comment>): Comment {
    const entity = new Comment();
    entity.id = v4();
    entity.text = 'Blog Content';
    entity.votes = 0;
    return Object.assign(entity, data);
  }
}
