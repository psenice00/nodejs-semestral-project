import { Blog } from 'src/blogs/domain/blog';
import { User } from 'src/users/domain/user';

export class Comment {
  id: string;
  text: string;
  votes: number;
  author?: User;
  authorId?: string;
  blog?: Blog;
  blogId?: string;
}
