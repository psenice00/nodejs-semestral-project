import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/user';
import { CreateBlogDto } from '../controller/dto/createBlog.dto';
import { UpdateBlogDto } from '../controller/dto/updateBlog.dto';
import { BlogRepository } from '../database/blog.repository';
import { Blog } from './blog';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  async findById(id: string): Promise<Blog | null> {
    return this.blogRepository.findById(id);
  }

  async find(): Promise<Blog[]> {
    return this.blogRepository.find();
  }

  async create(body: CreateBlogDto, user: User): Promise<Blog> {
    return this.blogRepository.create({ ...body, publisher: user });
  }

  async update(body: UpdateBlogDto, blog: Blog): Promise<Blog> {
    return this.blogRepository.update({ ...blog, ...body });
  }

  async delete(blog: Blog): Promise<boolean> {
    return this.blogRepository.softDelete(blog.id);
  }
}
