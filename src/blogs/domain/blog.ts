import { User } from 'src/users/domain/user';

export class Blog {
  id: string;
  title: string;
  text: string;
  imageUrl?: string;
  publisher?: User;
  publisherId?: string;
}
