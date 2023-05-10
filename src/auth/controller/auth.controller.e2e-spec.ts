import * as request from 'supertest';
import { TestingSetup } from 'src/common/testing/e2e-testing-setup';
import { DomainBuilder } from 'src/common/builders/domainBuilder';
import { EntityBuilder } from 'src/common/builders/entityBuilder';
import { HashService } from 'src/users/domain/hash.service';

describe('AuthController', () => {
  let testing: TestingSetup;
  let hashService: HashService;

  beforeAll(async () => {
    testing = await TestingSetup.setup();
    await testing.clearDb();
    hashService = testing.module.get(HashService);
  });

  afterAll(async () => {
    await testing.close();
  });

  it('POST /auth/login returns 401 when credentials are incorrect', async () => {
    await request(testing.app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'john.doe@email.com', password: 'password' })
      .expect(401);
  });

  it('POST /auth/login returns access token with status 200', async () => {
    const password = await hashService.hash('password');
    const user = DomainBuilder.getUser({ password });
    const userEntity = EntityBuilder.getUserEntity({ ...user });
    await testing.db.createEntityManager().save([userEntity]);

    await request(testing.app.getHttpServer())
      .post('/auth/login')
      .send({ email: userEntity.email, password: 'password' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toStrictEqual({
          accessToken: expect.any(String),
          expiresAt: expect.any(String),
        });
      });
  });

  it('POST /auth/register creates new user', async () => {
    const user = DomainBuilder.getUser({ email: 'jack.doe@email.com' });

    await request(testing.app.getHttpServer())
      .post('/auth/register')
      .send({
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toStrictEqual({
          accessToken: expect.any(String),
          expiresAt: expect.any(String),
        });
      });
  });

  it('POST /auth/register return error when email is already taken', async () => {
    const user = DomainBuilder.getUser();

    await request(testing.app.getHttpServer())
      .post('/auth/register')
      .send({
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
      })
      .expect(406)
      .expect((res) => {
        expect(res.body).toStrictEqual({
          statusCode: 406,
          message: 'This email is already registred!',
          error: 'Not Acceptable',
        });
      });
  });
});
