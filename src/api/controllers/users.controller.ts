import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from '../../domain/services/users.service';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import {
  UserResponse,
  CreateUserDto,
  UpdateUserDto,
} from 'src/common/dtos/users.dto';
import { JwtAuthGuard } from 'src/domain/auth/guards/jwt.guard';
import { RolesGuard } from 'src/domain/auth/guards/roles.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'create an user' })
  @ApiResponse({
    status: 201,
    type: UserResponse,
    description: 'User was successfully created.',
  })
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'create an admin user' })
  @ApiResponse({
    status: 201,
    type: UserResponse,
    description: 'User with Admin role was successfully created.',
  })
  @Post('admin')
  @ApiBearerAuth('access-token')
  @Roles(Role.Admin)
  createAdminUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createAdminUser(createUserDto);
  }

  @ApiOperation({ summary: 'find all users' })
  @ApiResponse({
    status: 200,
    isArray: true,
    type: UserResponse,
  })
  @ApiBearerAuth('access-token')
  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'update an user' })
  @ApiResponse({
    status: 200,
    type: UserResponse,
    description: 'User was successfully updated.',
  })
  @ApiBearerAuth('access-token')
  @Roles(Role.Admin)
  @HttpCode(200)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'delete an admin user' })
  @ApiResponse({
    status: 204,
    description: 'User was successfully deleted.',
  })
  @ApiBearerAuth('access-token')
  @Roles(Role.Admin)
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
