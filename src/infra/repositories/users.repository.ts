import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export class UsersRepository extends Repository<User> {
  // add your custom db related method here later..
}
