import { EntityBuilder } from './entityBuilder';
import { UserEntity } from 'src/users/database/user.entity';
import { BlogEntity } from 'src/blogs/database/blog.entity';
import { CommentEntity } from 'src/comments/database/comment.entity';

describe('EntityBuilder', () => {
  it('gets user domain with data merged', () => {
    const result = EntityBuilder.getUserEntity({
      createdAt: new Date('2021-12-24'),
      deletedAt: new Date('2022-12-24'),
    });

    expect(result).toBeInstanceOf(UserEntity);
    expect(result.createdAt).toStrictEqual(new Date('2021-12-24'));
    expect(result.deletedAt).toStrictEqual(new Date('2022-12-24'));
  });

  it('gets blog domain with data merged', () => {
    const result = EntityBuilder.getBlogEntity({
      title: 'new Title',
    });

    expect(result).toBeInstanceOf(BlogEntity);
    expect(result.title).toStrictEqual('new Title');
  });

  it('gets comment domain with data merged', () => {
    const result = EntityBuilder.getCommentEntity({
      text: 'new text comment',
    });

    expect(result).toBeInstanceOf(CommentEntity);
    expect(result.text).toStrictEqual('new text comment');
  });
});
