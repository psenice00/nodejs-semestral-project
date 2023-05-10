import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './database/comment.entity';
import { CommentController } from './controller/comment.controller';
import { CommentService } from './domain/comment.service';
import { CommentRepository } from './database/comment.repository';
import { BlogModule } from 'src/blogs/blogs.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity]), BlogModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
