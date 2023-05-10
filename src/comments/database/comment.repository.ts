import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { Comment } from '../domain/comment';
import { CommentFilterDto } from '../controller/dto/commentFilter.dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly repository: Repository<CommentEntity>,
  ) {}

  toDomain(entity: CommentEntity): Comment {
    return { ...entity };
  }

  async findById(id: string): Promise<Comment | null> {
    const result = await this.repository.findOne({
      where: { id },
    });
    return result ? this.toDomain(result) : null;
  }

  async find(filter?: CommentFilterDto): Promise<Comment[]> {
    const result = await this.repository.find({
      where: {
        ...(filter?.blogId && { blogId: filter.blogId }),
        ...(filter?.authorId && { authorId: filter.authorId }),
      },
    });

    return result.map(this.toDomain);
  }

  async create(
    comment: Pick<Comment, 'authorId' | 'blogId'> | Partial<Comment>,
  ): Promise<Comment> {
    return await this.repository.save(comment);
  }

  async update(
    comment: Partial<Omit<Comment, 'authorId' | 'blogId'>>,
  ): Promise<Comment> {
    return await this.repository.save(comment);
  }

  async softDelete(id: string): Promise<boolean> {
    const res = await this.repository.softDelete(id);
    return res.affected ? true : false;
  }
}
