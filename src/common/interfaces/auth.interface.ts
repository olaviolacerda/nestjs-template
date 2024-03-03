import { Role } from '../enums/role.enum';

export interface PayloadToken {
  id: string;
  role: Role;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
