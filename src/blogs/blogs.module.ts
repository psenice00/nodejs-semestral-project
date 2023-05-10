import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './controller/blog.controller';
import { BlogEntity } from './database/blog.entity';
import { BlogRepository } from './database/blog.repository';
import { BlogService } from './domain/blog.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity])],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository],
  exports: [BlogService],
})
export class BlogModule {}
