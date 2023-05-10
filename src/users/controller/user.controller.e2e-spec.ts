import * as request from 'supertest';
import { TestingSetup } from 'src/common/testing/e2e-testing-setup';
import { AuthService } from 'src/auth/domain/auth.service';
import { DomainBuilder } from 'src/common/builders/domainBuilder';
import { EntityBuilder } from 'src/common/builders/entityBuilder';
import { UserTypeEnum } from '../domain/enum/userType.enum';

const user = DomainBuilder.getUser();
const userEntity = EntityBuilder.getUserEntity({ ...user });

const admin = DomainBuilder.getUser({
  email: 'jack.doe@gmail.com',
  type: UserTypeEnum.admin,
});
const adminEntity = EntityBuilder.getUserEntity({ ...admin });

describe('BlogController', () => {
  let testing: TestingSetup;
  let tokenService: AuthService;
  let signedCustomerToken: string;
  let signedAdminToken: string;

  beforeAll(async () => {
    testing = await TestingSetup.setup();

    await testing.clearDb();

    tokenService = testing.module.get(AuthService);
    await testing.db.createEntityManager().save([userEntity, adminEntity]);
    signedCustomerToken = tokenService.getAccessToken(user);
    signedAdminToken = tokenService.getAccessToken(admin);
  });

  afterAll(async () => {
    await testing.close();
  });

  it('GET /users return 403 when user does not have admin rights', async () => {
    await request(testing.app.getHttpServer())
      .get('/users')
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .expect(403);
  });

  it('GET /users returns list of 2 users', async () => {
    await request(testing.app.getHttpServer())
      .get('/users')
      .set({ authorization: 'Bearer ' + signedAdminToken })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('GET /users/:id returns existing user by provided id with status 200', async () => {
    await request(testing.app.getHttpServer())
      .get(`/users/${userEntity.id}`)
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .expect(200)
      .expect((res) => {
        expect(res.body).toStrictEqual({
          id: userEntity.id,
          email: userEntity.email,
          firstName: userEntity.firstName,
          lastName: userEntity.lastName,
        });
      });
  });

  it('DELETE /users/:id return 403 when user does not have admin rights', async () => {
    const userToDelete = DomainBuilder.getUser({
      email: 'larry.doe@gmail.com',
    });
    const userToDeleteEntity = EntityBuilder.getUserEntity({ ...userToDelete });
    await testing.db.createEntityManager().save([userToDeleteEntity]);

    await request(testing.app.getHttpServer())
      .delete(`/users/${userToDelete.id}`)
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .expect(403);
  });

  it('DELETE /users/:id return 403 when user does not have admin rights', async () => {
    const userToDelete = DomainBuilder.getUser({
      email: 'larry.dou@gmail.com',
    });
    const userToDeleteEntity = EntityBuilder.getUserEntity({ ...userToDelete });
    await testing.db.createEntityManager().save([userToDeleteEntity]);

    await request(testing.app.getHttpServer())
      .delete(`/users/${userToDelete.id}`)
      .set({ authorization: 'Bearer ' + signedAdminToken })
      .expect(200);
  });
});
