import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty()
  @IsEnum(Role)
  readonly role: Role;
}

export class UserResponse {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426655440000' })
  readonly id: string;

  @ApiProperty({ enum: Role })
  readonly role: Role;

  @ApiProperty({ example: 'olaviolacerda' })
  readonly username: string;
}
