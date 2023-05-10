import { EntityBuilder } from 'src/common/builders/entityBuilder';
import { IntegrationTestingSetup } from 'src/common/testing/integration-testing-setup';
import { v4 } from 'uuid';
import { CommentRepository } from './comment.repository';

const userEntity = EntityBuilder.getUserEntity();
const blogEntity = EntityBuilder.getBlogEntity({
  publisherId: userEntity.id,
  publisher: userEntity,
});
const commentEntity = EntityBuilder.getCommentEntity({
  blog: blogEntity,
  blogId: blogEntity.id,
  author: userEntity,
  authorId: userEntity.id,
});

async function commonFixtures(): Promise<void> {
  await testing.db
    .createEntityManager()
    .save([userEntity, blogEntity, commentEntity]);
}

let testing: IntegrationTestingSetup;
let repo: CommentRepository;

async function setup(): Promise<void> {
  testing = await IntegrationTestingSetup.setup({
    providers: [CommentRepository],
  });

  repo = testing.getModule(CommentRepository);
}

describe('CommentRepository', () => {
  beforeEach(async () => {
    await setup();
    await commonFixtures();
  });

  afterEach(async () => {
    await testing.clearDb();
    await testing.close();
  });

  describe('#create', () => {
    it(' should create comment', async () => {
      const commentEntity = await repo.create(
        EntityBuilder.getCommentEntity({
          authorId: userEntity.id,
          blogId: blogEntity.id,
        }),
      );
      expect(await repo.findById(commentEntity.id)).toEqual({
        ...commentEntity,
        id: expect.any(String),
      });
    });
  });

  describe('#findAll', () => {
    it(' should return array with one comment', async () => {
      expect(await repo.find()).toHaveLength(1);
    });

    it(' should return array with one comment with applied filter', async () => {
      expect(await repo.find({ authorId: userEntity.id })).toHaveLength(1);
    });

    it(' should return array with one comment with applied filter', async () => {
      expect(await repo.find({ blogId: blogEntity.id })).toHaveLength(1);
    });

    it(' should return array with one comment with applied filter', async () => {
      expect(
        await repo.find({ blogId: blogEntity.id, authorId: userEntity.id }),
      ).toHaveLength(1);
    });

    it(' should return empty array for non existing id in filter', async () => {
      expect(await repo.find({ blogId: v4() })).toHaveLength(0);
    });
  });

  describe('#findById', () => {
    it('should return comment by provided id', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { author: _, blog: __, ...rest } = commentEntity;
      expect(await repo.findById(commentEntity.id)).toStrictEqual({
        ...rest,
      });
    });

    it('should return null for non existing id', async () => {
      expect(await repo.findById(v4())).toBeNull();
    });
  });

  describe('#update', () => {
    it('should update existing comment', async () => {
      expect(
        await repo.update({ ...commentEntity, text: 'New text' }),
      ).toStrictEqual({
        ...commentEntity,
        text: 'New text',
      });
    });
  });

  describe('#delete', () => {
    it('should soft-delete existing comment', async () => {
      expect(await repo.softDelete(commentEntity.id)).toBeTruthy();
    });

    it('should not soft-delete non-existing blog', async () => {
      expect(await repo.softDelete(v4())).toBeFalsy();
    });
  });
});
