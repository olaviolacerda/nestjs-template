import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

import { Role } from '../../../common/enums/role.enum';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty()
  @IsEnum(Role)
  @IsNotEmpty()
  readonly role: Role;

  @IsString()
  readonly refreshToken: string;
}
