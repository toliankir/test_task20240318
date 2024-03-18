import { User } from './user';

export interface UserFull extends User {
  email: string;
  password: string;
}
