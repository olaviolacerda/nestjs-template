import { Role } from '../enums/role.enum';

export interface User {
  id: string;
  username: string;
  role: Role;
  password?: string;
  refreshToken?: string;
  hashPassword?: () => Promise<void>;
}
