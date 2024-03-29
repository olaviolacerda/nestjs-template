import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Role } from '../../common/enums/role.enum';
import { User } from '../../common/interfaces/users.interface';

@Entity('users')
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
