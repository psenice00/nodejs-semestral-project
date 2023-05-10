import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateBlogDto } from './createBlog.dto';

describe('CreateBlogDto', () => {
  const basicValid: CreateBlogDto = {
    title: 'Some title',
    text: 'some text',
  };

  it('validates correctly required fields', async () => {
    expect(
      await validate(
        plainToClass(CreateBlogDto, {
          ...basicValid,
        } as CreateBlogDto),
      ),
    ).toHaveLength(0);
  });

  it('fails when title is empty', async () => {
    expect(
      await validate(
        plainToClass(CreateBlogDto, {
          ...basicValid,
          title: '',
        } as CreateBlogDto),
      ),
    ).toHaveLength(1);
  });

  it('fails when text is empty', async () => {
    expect(
      await validate(
        plainToClass(CreateBlogDto, {
          ...basicValid,
          text: '',
        } as CreateBlogDto),
      ),
    ).toHaveLength(1);
  });

  it('validates correctly all fields', async () => {
    const payload: Required<CreateBlogDto> = {
      ...basicValid,
      imageUrl: 'https://someurl.com',
    };

    expect(await validate(plainToClass(CreateBlogDto, payload))).toHaveLength(
      0,
    );
  });

  it('returns error when title has incorrect type', async () => {
    expect(
      await validate(
        plainToClass(CreateBlogDto, {
          ...basicValid,
          title: 20 as any,
        } as CreateBlogDto),
      ),
    ).toHaveLength(1);
  });

  it('returns error when optional parameter is present in incorrect type', async () => {
    expect(
      await validate(
        plainToClass(CreateBlogDto, {
          ...basicValid,
          imageUrl: 20 as any,
        } as CreateBlogDto),
      ),
    ).toHaveLength(1);
  });
});
