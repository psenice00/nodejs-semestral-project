import { BlogService } from 'src/blogs/domain/blog.service';
import { BlogWithAccessCheckPipe } from './blogWithAccessCheck.pipe';
import { DomainBuilder } from '../builders/domainBuilder';
import { createMock } from '@golevelup/ts-jest';
import { MembershipAccessActions } from 'src/users/domain/enum/memberShipAccessActions.enum';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const user = DomainBuilder.getUser();
const userWithoutBlog = DomainBuilder.getUser();
const blog = DomainBuilder.getBlog({ publisherId: user.id });

const blogServiceMock = createMock<BlogService>({
  findById: async () => blog,
});

describe('BlogWithAccessCheckPipe', () => {
  describe('blog found with access', () => {
    const blogPipe = new BlogWithAccessCheckPipe(blogServiceMock);

    it('should return blog for owner with action READ', async () => {
      expect(
        await blogPipe.transform({
          blogId: blog.id,
          action: MembershipAccessActions.READ,
          user: user,
        }),
      ).toStrictEqual(blog);
    });
    it('should return blog for owner with action UPDATE', async () => {
      expect(
        await blogPipe.transform({
          blogId: blog.id,
          action: MembershipAccessActions.UPDATE,
          user: user,
        }),
      ).toStrictEqual(blog);
    });
    it('should return blog for owner with action DELETE', async () => {
      expect(
        await blogPipe.transform({
          blogId: blog.id,
          action: MembershipAccessActions.DELETE,
          user: user,
        }),
      ).toStrictEqual(blog);
    });
    it('should return blog for owner with action CREATE', async () => {
      expect(
        await blogPipe.transform({
          blogId: blog.id,
          action: MembershipAccessActions.CREATE,
          user: user,
        }),
      ).toStrictEqual(blog);
    });
  });

  describe('blog not found', () => {
    const blogPipe = new BlogWithAccessCheckPipe(
      createMock<BlogService>({
        findById: async () => null,
      }),
    );

    it('should return blog', async () => {
      expect(
        blogPipe.transform({
          blogId: blog.id,
          action: MembershipAccessActions.READ,
          user: user,
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('blog found but locked by someone else', () => {
    const blogPipe = new BlogWithAccessCheckPipe(blogServiceMock);

    it('should return blog only when action is than READ', async () => {
      expect(
        await blogPipe.transform({
          blogId: blog.id,
          action: MembershipAccessActions.READ,
          user: userWithoutBlog,
        }),
      ).toStrictEqual(blog);
    });

    it('should throw ForbiddenException for UPDATE action', async () => {
      expect(
        blogPipe.transform({
          blogId: blog.id,
          action: MembershipAccessActions.UPDATE,
          user: userWithoutBlog,
        }),
      ).rejects.toThrowError(ForbiddenException);
    });

    it('should throw ForbiddenException for UPDATE action', async () => {
      expect(
        blogPipe.transform({
          blogId: blog.id,
          action: MembershipAccessActions.DELETE,
          user: userWithoutBlog,
        }),
      ).rejects.toThrowError(ForbiddenException);
    });

    it('should throw ForbiddenException for UPDATE action', async () => {
      expect(
        blogPipe.transform({
          blogId: blog.id,
          action: MembershipAccessActions.CREATE,
          user: userWithoutBlog,
        }),
      ).rejects.toThrowError(ForbiddenException);
    });
  });
});
