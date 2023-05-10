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
import { Blog } from '../domain/blog';
import { BlogService } from '../domain/blog.service';
import { BlogDto } from './dto/blog.dto';
import { CreateBlogDto } from './dto/createBlog.dto';
import { UpdateBlogDto } from './dto/updateBlog.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

// identification and authentification failure
@UseGuards(UserAuthGuard)
@Controller('/blogs')
@ApiTags('blog')
@CustomClassSerializerInterceptor(BlogDto)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiOkResponse({ type: BlogDto })
  async create(
    @Body() body: CreateBlogDto,
    @CurrentUser() currentUser: User,
  ): Promise<BlogDto> {
    return this.blogService.create(body, currentUser);
  }

  @Get()
  @ApiOkResponse({ type: [BlogDto] })
  async find(): Promise<BlogDto[]> {
    return this.blogService.find();
  }

  @Get('/:blogId')
  @ApiOkResponse({ type: BlogDto })
  async findById(
    @BlogWithAccessFromParam(MembershipAccessActions.READ) blog: Blog,
  ): Promise<BlogDto> {
    return blog;
  }

  @Patch('/:blogId')
  @ApiOkResponse({ type: BlogDto })
  async update(
    @Body() body: UpdateBlogDto,
    @BlogWithAccessFromParam(MembershipAccessActions.UPDATE) blog: Blog,
  ): Promise<BlogDto> {
    return this.blogService.update(body, blog);
  }

  @Delete('/:blogId')
  @ApiOkResponse({ type: BlogDto })
  async delete(
    @BlogWithAccessFromParam(MembershipAccessActions.DELETE) blog: Blog,
  ): Promise<void> {
    await this.blogService.delete(blog);
  }
}
