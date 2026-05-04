import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() body: any) {
    return this.usersService.create(body);
  }

  @Get()
  getAllUsers() {
    return this.usersService.getAll();
  }

  @Get(':id')
  getOneUser(@Param('id') id: string) {
    return this.usersService.getOne(Number(id));
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(Number(id), body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(Number(id));
  }
}