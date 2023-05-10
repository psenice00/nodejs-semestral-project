import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { Comment } from 'src/comments/domain/comment';
import { CommentService } from 'src/comments/domain/comment.service';
import { MembershipAccessActions } from 'src/users/domain/enum/memberShipAccessActions.enum';
import { UserTypeEnum } from 'src/users/domain/enum/userType.enum';
import { User } from 'src/users/domain/user';

export const GetCommentIdWithActionFromParam = createParamDecorator(
  (action: MembershipAccessActions, ctx: ExecutionContext) => {
    return {
      action,
      commentId: ctx.switchToHttp().getRequest().params.commentId,
      user: ctx.getArgByIndex(0).user,
    };
  },
);

export const CommentWithAccessFromParam = (
  action: MembershipAccessActions,
): ParameterDecorator =>
  GetCommentIdWithActionFromParam(action, CommentWithAccessCheckPipe);

@Injectable()
export class CommentWithAccessCheckPipe implements PipeTransform {
  constructor(private readonly commentService: CommentService) {}

  async transform(value: {
    commentId: string;
    action: MembershipAccessActions;
    user: User;
  }): Promise<Comment | null> {
    const comment = await this.commentService.findById(value.commentId);

    if (!comment) {
      throw new NotFoundException('Comment was not found!');
    }

    if (
      //reading blog is allowed to everyone
      value.action === MembershipAccessActions.READ ||
      //user is admin
      value.user.type === UserTypeEnum.admin ||
      //owner of the blog post
      value.user.id === comment.authorId ||
      (value.action === MembershipAccessActions.DELETE &&
        value.user.id === comment.authorId)
    ) {
      return comment;
    }

    throw new ForbiddenException(
      'You are not allowed to modify this resource!',
    );
  }
}
