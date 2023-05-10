import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/user.decorator';
import { BlogWithAccessFromParam } from 'src/common/pipes/blogWithAccessCheck.pipe';
import { CustomClassSerializerInterceptor } from 'src/common/serializer.inceptor';
import { MembershipAccessActions } from 'src/users/domain/enum/memberShipAccessActions.enum';
import { User } from 'src/users/domain/user';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { CommentService } from '../domain/comment.service';
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/createComment.dto';
import { Blog } from 'src/blogs/domain/blog';
import { CommentFilterDto } from './dto/commentFilter.dto';
import { CommentWithAccessFromParam } from 'src/common/pipes/commentWithAccessCheck.pipe';
import { Comment } from '../domain/comment';

// identification and authentification failure
@UseGuards(UserAuthGuard)
@Controller('/comments')
@ApiTags('comments')
@CustomClassSerializerInterceptor(CommentDto)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:blogId')
  @ApiParam({ name: 'blogId', type: 'string' })
  @ApiOkResponse({ type: CommentDto })
  async create(
    @Body() body: CreateCommentDto,
    @CurrentUser() currentUser: User,
    @BlogWithAccessFromParam(MembershipAccessActions.READ) blog: Blog,
  ): Promise<CommentDto> {
    return this.commentService.create(body, currentUser, blog);
  }

  @Get()
  @ApiOkResponse({ type: [CommentDto] })
  async find(@Body() body: CommentFilterDto): Promise<CommentDto[]> {
    return this.commentService.find(body);
  }

  @Get('/:commentId')
  @ApiParam({ name: 'commentId', type: 'string' })
  @ApiOkResponse({ type: CommentDto })
  async findById(
    @CommentWithAccessFromParam(MembershipAccessActions.READ) comment: Comment,
  ): Promise<CommentDto> {
    return comment;
  }

  @Patch('/:commentId')
  @ApiParam({ name: 'commentId', type: 'string' })
  @ApiOkResponse({ type: CommentDto })
  async update(
    @Body() body: CreateCommentDto,
    @CommentWithAccessFromParam(MembershipAccessActions.UPDATE)
    comment: Comment,
  ): Promise<CommentDto> {
    return this.commentService.update(body, comment);
  }

  @Post('/:commentId/upvote')
  @ApiParam({ name: 'commentId', type: 'string' })
  @ApiOkResponse({ type: CommentDto })
  async upvote(
    @CommentWithAccessFromParam(MembershipAccessActions.UPDATE)
    comment: Comment,
  ): Promise<CommentDto> {
    return this.commentService.upvote(comment);
  }

  @Post('/:commentId/downvote')
  @ApiParam({ name: 'commentId', type: 'string' })
  @ApiOkResponse({ type: CommentDto })
  async downvote(
    @CommentWithAccessFromParam(MembershipAccessActions.UPDATE)
    comment: Comment,
  ): Promise<CommentDto> {
    return this.commentService.downvote(comment);
  }

  @Delete('/:commentId')
  @ApiParam({ name: 'commentId', type: 'string' })
  @ApiOkResponse({ type: CommentDto })
  async delete(
    @CommentWithAccessFromParam(MembershipAccessActions.DELETE)
    comment: Comment,
  ): Promise<void> {
    await this.commentService.delete(comment);
  }
}
