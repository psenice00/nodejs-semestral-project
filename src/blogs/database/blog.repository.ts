import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blog';
import { BlogEntity } from './Blog.entity';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly repository: Repository<BlogEntity>,
  ) {}

  toDomain(entity: BlogEntity): Blog {
    return { ...entity };
  }

  async findById(id: string): Promise<Blog | null> {
    const result = await this.repository.findOne({
      where: { id },
    });

    // possible sql injection: '; DROP TABLE user_entity; --
    // const result = `SELECT * FROM blog_entity WHERE id = '${id}'`;

    return result ? this.toDomain(result) : null;
  }

  // should be paginated
  async find(): Promise<Blog[]> {
    const result = await this.repository.find();
    return result.map(this.toDomain);
  }

  async create(blog: Partial<Blog>): Promise<Blog> {
    return await this.repository.save(blog);
  }

  async update(blog: Blog): Promise<Blog> {
    return await this.repository.save(blog);
  }

  async softDelete(id: string): Promise<boolean> {
    const res = await this.repository.softDelete(id);
    return res.affected ? true : false;
  }
}
