import { ApiProperty } from '@nestjs/swagger';

import { Role } from '../../../common/enums/role.enum';
import { User } from './../../interfaces/users.interface';

export class UserResponse implements User {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426655440000' })
  readonly id: string;

  @ApiProperty({ enum: Role })
  readonly role: Role;

  @ApiProperty({ example: 'olaviolacerda' })
  readonly username: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  readonly refreshToken: string;
}
