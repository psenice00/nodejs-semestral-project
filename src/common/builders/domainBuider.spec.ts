import { User } from 'src/users/domain/user';
import { DomainBuilder } from './domainBuilder';
import { Blog } from 'src/blogs/domain/blog';
import { Comment } from 'src/comments/domain/comment';

describe('DomainBuilder', () => {
  it('gets user domain with data merged', () => {
    const result = DomainBuilder.getUser({
      createdAt: new Date('2021-12-24'),
      deletedAt: new Date('2022-12-24'),
    });

    expect(result).toBeInstanceOf(User);
    expect(result.createdAt).toStrictEqual(new Date('2021-12-24'));
    expect(result.deletedAt).toStrictEqual(new Date('2022-12-24'));
  });

  it('gets blog domain with data merged', () => {
    const result = DomainBuilder.getBlog({
      title: 'new Title',
    });

    expect(result).toBeInstanceOf(Blog);
    expect(result.title).toStrictEqual('new Title');
  });

  it('gets comment domain with data merged', () => {
    const result = DomainBuilder.getComment({
      text: 'new text comment',
    });

    expect(result).toBeInstanceOf(Comment);
    expect(result.text).toStrictEqual('new text comment');
  });
});
