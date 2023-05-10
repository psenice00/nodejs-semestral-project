import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/user';
import { CommentRepository } from '../database/comment.repository';
import { Comment } from './comment';
import { CommentFilterDto } from '../controller/dto/commentFilter.dto';
import { Blog } from 'src/blogs/domain/blog';
import { CreateCommentDto } from '../controller/dto/createComment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async findById(id: string): Promise<Comment | null> {
    return this.commentRepository.findById(id);
  }

  async find(filter?: CommentFilterDto): Promise<Comment[]> {
    return this.commentRepository.find(filter);
  }

  async create(
    body: CreateCommentDto,
    user: User,
    blog: Blog,
  ): Promise<Comment> {
    return this.commentRepository.create({
      text: body.text,
      votes: 0,
      author: user,
      blog,
    });
  }

  async update(body: CreateCommentDto, comment: Comment): Promise<Comment> {
    return this.commentRepository.update({ ...comment, ...body });
  }

  async upvote(comment: Comment): Promise<Comment> {
    return this.commentRepository.update({
      votes: comment.votes + 1,
      text: comment.text,
      id: comment.id,
    });
  }

  async downvote(comment: Comment): Promise<Comment> {
    return this.commentRepository.update({
      votes: comment.votes - 1,
      text: comment.text,
      id: comment.id,
    });
  }

  async delete(comment: Comment): Promise<boolean> {
    return this.commentRepository.softDelete(comment.id);
  }
}
