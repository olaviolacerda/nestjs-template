import { Role } from '../../src/common/enums/role.enum';
import { User } from '../../src/core/entities/user.entity';

export const mockUser: User = {
  id: 'id',
  username: 'fake',
  role: Role.User,
  refreshToken: 'refreshToken',
  password: 'fakePass',
  hashPassword: () => Promise.resolve(),
};

export class UsersRepositoryFake {
  public async create(): Promise<any> {}
  public async save(): Promise<any> {}
  public async remove(): Promise<any> {}
  public async findOne(): Promise<any> {}
  public async find(): Promise<any> {}
  public async preload(): Promise<any> {}
}
