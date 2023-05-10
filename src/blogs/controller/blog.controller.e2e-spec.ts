import * as request from 'supertest';
import { TestingSetup } from 'src/common/testing/e2e-testing-setup';
import { AuthService } from 'src/auth/domain/auth.service';
import { DomainBuilder } from 'src/common/builders/domainBuilder';
import { EntityBuilder } from 'src/common/builders/entityBuilder';
import { v4 } from 'uuid';
import { BlogEntity } from '../database/blog.entity';

const user = DomainBuilder.getUser();
const userEntity = EntityBuilder.getUserEntity({ ...user });

describe('BlogController', () => {
  let testing: TestingSetup;
  let tokenService: AuthService;
  let signedCustomerToken: string;

  beforeAll(async () => {
    testing = await TestingSetup.setup();

    await testing.clearDb();

    tokenService = testing.module.get(AuthService);
    await testing.db.createEntityManager().save([userEntity]);
    signedCustomerToken = tokenService.getAccessToken(user);
  });

  afterAll(async () => {
    await testing.close();
  });

  it('GET /blogs retuns empty array with status 200', async () => {
    await request(testing.app.getHttpServer())
      .get('/blogs')
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .expect(200)
      .expect((res) => {
        expect(res.body).toStrictEqual([]);
      });
  });

  it('GET /blogs/:id returns existing blog by provided id with status 200', async () => {
    const blogEntity = EntityBuilder.getBlogEntity({
      publisherId: userEntity.id,
    });
    await testing.db.createEntityManager().save([blogEntity]);

    await request(testing.app.getHttpServer())
      .get(`/blogs/${blogEntity.id}`)
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .expect(200)
      .expect((res) => {
        expect(res.body).toStrictEqual({
          id: blogEntity.id,
          imageUrl: blogEntity.imageUrl,
          text: blogEntity.text,
          title: blogEntity.title,
        });
      });
  });

  it('GET /blogs/:id returns status 404 for provided non-existing id', async () => {
    await request(testing.app.getHttpServer())
      .get(`/blogs/${v4()}`)
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .expect(404);
  });

  it('POST /blogs creates blog with provided data', async () => {
    const blog = DomainBuilder.getBlog();
    await request(testing.app.getHttpServer())
      .post(`/blogs`)
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .send({
        title: blog.title,
        text: blog.text,
        imageUrl: blog.imageUrl,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toStrictEqual({
          id: expect.any(String),
          imageUrl: blog.imageUrl,
          text: blog.text,
          title: blog.title,
        });
      });
  });

  it('PATCH /blogs/:id updates blog by provided id', async () => {
    const blog = DomainBuilder.getBlog();
    const blogEntity = EntityBuilder.getBlogEntity({
      ...blog,
      publisherId: userEntity.id,
    });
    await testing.db.createEntityManager().save([blogEntity]);

    await request(testing.app.getHttpServer())
      .patch(`/blogs/${blogEntity.id}`)
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .send({
        title: 'New Title',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toStrictEqual({
          id: expect.any(String),
          imageUrl: blog.imageUrl,
          text: blog.text,
          title: 'New Title',
        });
      });
  });

  it('DELETE /blogs/:id updates blog by provided id', async () => {
    const blog = DomainBuilder.getBlog();
    const blogEntity = EntityBuilder.getBlogEntity({
      ...blog,
      publisherId: userEntity.id,
    });
    await testing.db.createEntityManager().save([blogEntity]);

    await request(testing.app.getHttpServer())
      .delete(`/blogs/${blogEntity.id}`)
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .expect(200);

    const res = await testing.db
      .createEntityManager()
      .findOne(BlogEntity, { where: { id: blogEntity.id } });
    expect(res).toBe(null);
  });
});
