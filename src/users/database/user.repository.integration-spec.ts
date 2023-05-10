import { EntityBuilder } from 'src/common/builders/entityBuilder';
import { UserRepository } from './user.repository';
import { IntegrationTestingSetup } from 'src/common/testing/integration-testing-setup';
import { QueryFailedError } from 'typeorm';
import { v4 } from 'uuid';

const userEntity = EntityBuilder.getUserEntity();

async function commonFixtures(): Promise<void> {
  await testing.db.createEntityManager().save([userEntity]);
}

let testing: IntegrationTestingSetup;
let repo: UserRepository;

async function setup(): Promise<void> {
  testing = await IntegrationTestingSetup.setup({
    providers: [UserRepository],
  });

  repo = testing.getModule(UserRepository);
}

describe('UserRepository', () => {
  beforeEach(async () => {
    await setup();
    await commonFixtures();
  });

  afterEach(async () => {
    await testing.clearDb();
    await testing.close();
  });

  describe('#create', () => {
    it(' should create user', async () => {
      const userInput = EntityBuilder.getUserEntity({
        email: 'jack.doe@email.com',
      });

      const user = await repo.create(userInput);
      expect(await repo.findById(user.id)).toEqual({
        ...userInput,
        createdAt: expect.any(Date),
        id: expect.any(String),
      });
    });

    it(' should fails on email duplicity constraints', async () => {
      const userInput = EntityBuilder.getUserEntity();
      await expect(repo.create(userInput)).rejects.toThrow(QueryFailedError);
    });
  });

  describe('#findAll', () => {
    it(' should return array with one user', async () => {
      expect(await repo.findAll()).toHaveLength(1);
    });
  });

  describe('#findByEmail', () => {
    it('should return user by provided email', async () => {
      expect(await repo.findByEmail(userEntity.email)).toStrictEqual({
        ...userEntity,
      });
    });

    it('should return null for non existing email', async () => {
      expect(await repo.findByEmail('not.existing@email.com')).toBeNull();
    });
  });

  describe('#findById', () => {
    it('should return user by provided id', async () => {
      expect(await repo.findById(userEntity.id)).toStrictEqual({
        ...userEntity,
      });
    });

    it('should return null for non existing email', async () => {
      expect(await repo.findById(v4())).toBeNull();
    });
  });

  describe('#findByEmail', () => {
    it('should return user by provided email', async () => {
      expect(await repo.findByEmail(userEntity.email)).toStrictEqual({
        ...userEntity,
      });
    });

    it('should return null for non existing email', async () => {
      expect(await repo.findByEmail('not.existing@email.com')).toBeNull();
    });
  });

  describe('#update', () => {
    it('should update existing user', async () => {
      expect(
        await repo.update(userEntity.id, { firstName: 'Larry' }),
      ).toStrictEqual({
        id: userEntity.id,
        firstName: 'Larry',
        deletedAt: null,
        lastLoginAt: null,
      });
    });

    it('should not update non-existing user', async () => {
      const nonExistingId = v4();
      await expect(
        repo.update(nonExistingId, { firstName: 'Larry' }),
      ).rejects.toThrowError(QueryFailedError);
    });
  });

  describe('#delete', () => {
    it('should soft-delete existing user', async () => {
      expect(await repo.softDelete(userEntity.id)).toBeTruthy();
    });

    it('should not soft-delete non-existing user', async () => {
      expect(await repo.softDelete(v4())).toBeFalsy();
    });
  });
});
