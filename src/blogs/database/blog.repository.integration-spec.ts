import { EntityBuilder } from 'src/common/builders/entityBuilder';
import { IntegrationTestingSetup } from 'src/common/testing/integration-testing-setup';
import { v4 } from 'uuid';
import { BlogRepository } from './blog.repository';

const userEntity = EntityBuilder.getUserEntity();
const blogEntity = EntityBuilder.getBlogEntity({
  publisherId: userEntity.id,
  publisher: userEntity,
});

async function commonFixtures(): Promise<void> {
  await testing.db.createEntityManager().save([userEntity, blogEntity]);
}

let testing: IntegrationTestingSetup;
let repo: BlogRepository;

async function setup(): Promise<void> {
  testing = await IntegrationTestingSetup.setup({
    providers: [BlogRepository],
  });

  repo = testing.getModule(BlogRepository);
}

describe('BlogRepository', () => {
  beforeEach(async () => {
    await setup();
    await commonFixtures();
  });

  afterEach(async () => {
    await testing.clearDb();
    await testing.close();
  });

  describe('#create', () => {
    it(' should create blog', async () => {
      const blogEntity = await repo.create(
        EntityBuilder.getBlogEntity({ publisher: userEntity }),
      );
      expect(await repo.findById(blogEntity.id)).toEqual({
        title: blogEntity.title,
        text: blogEntity.text,
        publisherId: blogEntity.publisherId,
        imageUrl: blogEntity.imageUrl,
        deletedAt: null,
        id: expect.any(String),
      });
    });
  });

  describe('#findAll', () => {
    it(' should return array with one blog', async () => {
      expect(await repo.find()).toHaveLength(1);
    });
  });

  describe('#findById', () => {
    it('should return blog by provided id', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { publisher: _, ...rest } = blogEntity;
      expect(await repo.findById(blogEntity.id)).toStrictEqual({
        ...rest,
      });
    });

    it('should return null for non existing id', async () => {
      expect(await repo.findById(v4())).toBeNull();
    });
  });

  describe('#update', () => {
    it('should update existing blog', async () => {
      expect(
        await repo.update({ ...blogEntity, title: 'New title' }),
      ).toStrictEqual({
        ...blogEntity,
        title: 'New title',
      });
    });
  });

  describe('#delete', () => {
    it('should soft-delete existing blog', async () => {
      expect(await repo.softDelete(blogEntity.id)).toBeTruthy();
    });

    it('should not soft-delete non-existing blog', async () => {
      expect(await repo.softDelete(v4())).toBeFalsy();
    });
  });
});
