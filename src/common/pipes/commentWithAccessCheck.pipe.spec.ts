import { DomainBuilder } from '../builders/domainBuilder';
import { createMock } from '@golevelup/ts-jest';
import { MembershipAccessActions } from 'src/users/domain/enum/memberShipAccessActions.enum';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentWithAccessCheckPipe } from './commentWithAccessCheck.pipe';
import { CommentService } from 'src/comments/domain/comment.service';

const user = DomainBuilder.getUser();
const userWithoutBlog = DomainBuilder.getUser();
const blog = DomainBuilder.getBlog({ publisherId: user.id });
const comment = DomainBuilder.getComment({
  blogId: blog.id,
  authorId: user.id,
});

const commentServiceMock = createMock<CommentService>({
  findById: async () => comment,
});

describe('CommentWithAccessCheckPipe', () => {
  describe('comment found with access', () => {
    const commentPipe = new CommentWithAccessCheckPipe(commentServiceMock);

    it('should return comment for owner with action READ', async () => {
      expect(
        await commentPipe.transform({
          commentId: comment.id,
          action: MembershipAccessActions.READ,
          user: user,
        }),
      ).toStrictEqual(comment);
    });
    it('should return comment for owner with action UPDATE', async () => {
      expect(
        await commentPipe.transform({
          commentId: comment.id,
          action: MembershipAccessActions.UPDATE,
          user: user,
        }),
      ).toStrictEqual(comment);
    });
    it('should return comment for owner with action DELETE', async () => {
      expect(
        await commentPipe.transform({
          commentId: comment.id,
          action: MembershipAccessActions.DELETE,
          user: user,
        }),
      ).toStrictEqual(comment);
    });
    it('should return comment for owner with action CREATE', async () => {
      expect(
        await commentPipe.transform({
          commentId: comment.id,
          action: MembershipAccessActions.CREATE,
          user: user,
        }),
      ).toStrictEqual(comment);
    });
  });

  describe('comment not found', () => {
    const commentPipe = new CommentWithAccessCheckPipe(
      createMock<CommentService>({
        findById: async () => null,
      }),
    );

    it('should return comment', async () => {
      expect(
        commentPipe.transform({
          commentId: comment.id,
          action: MembershipAccessActions.READ,
          user: user,
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('comment found but locked by someone else', () => {
    const commentPipe = new CommentWithAccessCheckPipe(commentServiceMock);

    it('should return comment only when action is than READ', async () => {
      expect(
        await commentPipe.transform({
          commentId: comment.id,
          action: MembershipAccessActions.READ,
          user: userWithoutBlog,
        }),
      ).toStrictEqual(comment);
    });

    it('should throw ForbiddenException for UPDATE action', async () => {
      expect(
        commentPipe.transform({
          commentId: comment.id,
          action: MembershipAccessActions.UPDATE,
          user: userWithoutBlog,
        }),
      ).rejects.toThrowError(ForbiddenException);
    });

    it('should throw ForbiddenException for UPDATE action', async () => {
      expect(
        commentPipe.transform({
          commentId: comment.id,
          action: MembershipAccessActions.DELETE,
          user: userWithoutBlog,
        }),
      ).rejects.toThrowError(ForbiddenException);
    });

    it('should throw ForbiddenException for UPDATE action', async () => {
      expect(
        commentPipe.transform({
          commentId: comment.id,
          action: MembershipAccessActions.CREATE,
          user: userWithoutBlog,
        }),
      ).rejects.toThrowError(ForbiddenException);
    });
  });
});
