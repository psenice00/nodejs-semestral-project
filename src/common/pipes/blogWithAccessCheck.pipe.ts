import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { Blog } from 'src/blogs/domain/blog';
import { BlogService } from 'src/blogs/domain/blog.service';
import { MembershipAccessActions } from 'src/users/domain/enum/memberShipAccessActions.enum';
import { UserTypeEnum } from 'src/users/domain/enum/userType.enum';
import { User } from 'src/users/domain/user';

export const GetBlogIdWithActionFromParam = createParamDecorator(
  (action: MembershipAccessActions, ctx: ExecutionContext) => {
    return {
      action,
      blogId: ctx.switchToHttp().getRequest().params.blogId,
      user: ctx.getArgByIndex(0).user,
    };
  },
);

export const BlogWithAccessFromParam = (
  action: MembershipAccessActions,
): ParameterDecorator =>
  GetBlogIdWithActionFromParam(action, BlogWithAccessCheckPipe);

@Injectable()
export class BlogWithAccessCheckPipe implements PipeTransform {
  constructor(private readonly blogService: BlogService) {}

  async transform(value: {
    blogId: string;
    action: MembershipAccessActions;
    user: User;
  }): Promise<Blog | null> {
    const blog = await this.blogService.findById(value.blogId);
    if (!blog) {
      throw new NotFoundException('Blog was not found!');
    }

    // in real project more complex access rights :D
    if (
      //reading blog is allowed to everyone
      value.action === MembershipAccessActions.READ ||
      //user is admin
      value.user.type === UserTypeEnum.admin ||
      //owner of the blog post
      value.user.id === blog.publisherId
    ) {
      return blog;
    }

    throw new ForbiddenException(
      'You are not allowed to modify this resource!',
    );
  }
}
