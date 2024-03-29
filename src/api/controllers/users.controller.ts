import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  HttpCode,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { Roles } from '../../common/decorators/roles.decorator';
import { CreateUserDto } from '../../common/dtos/users/create-user.dto';
import { UpdateUserDto } from '../../common/dtos/users/update-user.dto';
import { Role } from '../../common/enums/role.enum';
import { UserResponse } from '../../common/responses/users/user.response';
import { JwtAuthGuard } from '../../core/auth/guards/jwt.guard';
import { RolesGuard } from '../../core/auth/guards/roles.guard';
import { UsersService } from '../../core/providers/services/users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'create an user' })
  @ApiResponse({
    status: 201,
    type: UserResponse,
    description: 'User was successfully created.',
  })
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
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
