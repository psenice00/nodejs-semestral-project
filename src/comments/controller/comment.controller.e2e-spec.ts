import * as request from 'supertest';
import { TestingSetup } from 'src/common/testing/e2e-testing-setup';
import { AuthService } from 'src/auth/domain/auth.service';
import { DomainBuilder } from 'src/common/builders/domainBuilder';
import { EntityBuilder } from 'src/common/builders/entityBuilder';

const user = DomainBuilder.getUser();
const userEntity = EntityBuilder.getUserEntity({ ...user });

const blog = DomainBuilder.getBlog({ publisher: user, publisherId: user.id });
const blogEntity = EntityBuilder.getBlogEntity({ ...blog });

describe('BlogController', () => {
  let testing: TestingSetup;
  let tokenService: AuthService;
  let signedCustomerToken: string;

  beforeAll(async () => {
    testing = await TestingSetup.setup();

    await testing.clearDb();

    tokenService = testing.module.get(AuthService);
    await testing.db.createEntityManager().save([userEntity, blogEntity]);
    signedCustomerToken = tokenService.getAccessToken(user);
  });

  afterAll(async () => {
    await testing.close();
  });

  it('POST /comments/:blogId creates comment ', async () => {
    await request(testing.app.getHttpServer())
      .post(`/comments/${blogEntity.id}`)
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .send({ text: 'probably some hate comment' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toStrictEqual({
          id: expect.any(String),
          text: 'probably some hate comment',
          votes: 0,
        });
      });
  });

  it('GET /comments retuns empty array with status 200', async () => {
    await request(testing.app.getHttpServer())
      .get('/comments')
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
      });
  });

  it('GET /comments/:id return comment by id', async () => {
    const comment = DomainBuilder.getComment({
      blogId: blog.id,
      blog: blog,
      author: user,
      authorId: user.id,
    });
    const commentEntity = EntityBuilder.getCommentEntity({
      ...comment,
      blog: blogEntity,
      blogId: blogEntity.id,
    });
    await testing.db.createEntityManager().save([commentEntity]);

    await request(testing.app.getHttpServer())
      .get(`/comments/${commentEntity.id}`)
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .expect(200)
      .expect((res) => {
        expect(res.body).toStrictEqual({
          id: commentEntity.id,
          text: commentEntity.text,
          votes: commentEntity.votes,
        });
      });
  });

  it('PATCH /comments/:id updates comment by id', async () => {
    const comment = DomainBuilder.getComment({
      blogId: blog.id,
      blog: blog,
      author: user,
      authorId: user.id,
    });
    const commentEntity = EntityBuilder.getCommentEntity({
      ...comment,
      blog: blogEntity,
      blogId: blogEntity.id,
    });
    await testing.db.createEntityManager().save([commentEntity]);

    await request(testing.app.getHttpServer())
      .patch(`/comments/${commentEntity.id}`)
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .send({ text: 'updated hate comment(more hate full :/)' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toStrictEqual({
          id: commentEntity.id,
          text: 'updated hate comment(more hate full :/)',
          votes: commentEntity.votes,
        });
      });
  });

  it('POST /comments/:id/upvote increse votes by 1', async () => {
    const comment = DomainBuilder.getComment({
      blogId: blog.id,
      blog: blog,
      author: user,
      authorId: user.id,
    });
    const commentEntity = EntityBuilder.getCommentEntity({
      ...comment,
      blog: blogEntity,
      blogId: blogEntity.id,
    });
    await testing.db.createEntityManager().save([commentEntity]);
    await request(testing.app.getHttpServer())
      .post(`/comments/${commentEntity.id}/upvote`)
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .expect(201)
      .expect((res) => {
        expect(res.body).toStrictEqual({
          id: commentEntity.id,
          text: commentEntity.text,
          votes: commentEntity.votes + 1,
        });
      });
  });

  it('POST /comments/:id/downvote decrese votes by 1', async () => {
    const comment = DomainBuilder.getComment({
      blogId: blog.id,
      blog: blog,
      author: user,
      authorId: user.id,
    });
    const commentEntity = EntityBuilder.getCommentEntity({
      ...comment,
      blog: blogEntity,
      blogId: blogEntity.id,
    });
    await testing.db.createEntityManager().save([commentEntity]);
    await request(testing.app.getHttpServer())
      .post(`/comments/${commentEntity.id}/downvote`)
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .expect(201)
      .expect((res) => {
        expect(res.body).toStrictEqual({
          id: commentEntity.id,
          text: commentEntity.text,
          votes: commentEntity.votes - 1,
        });
      });
  });

  it('DELETE /comments/:id deletes comment by id', async () => {
    const comment = DomainBuilder.getComment({
      blogId: blog.id,
      blog: blog,
      author: user,
      authorId: user.id,
    });
    const commentEntity = EntityBuilder.getCommentEntity({
      ...comment,
      blog: blogEntity,
      blogId: blogEntity.id,
    });
    await testing.db.createEntityManager().save([commentEntity]);
    await request(testing.app.getHttpServer())
      .delete(`/comments/${commentEntity.id}`)
      .set({ authorization: 'Bearer ' + signedCustomerToken })
      .expect(200);
  });
});
