import {
  Controller, Get, Put, Delete,
  Param, Body, Request, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('api/v1/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; faculty?: string; year?: number },
  ) {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async deleteUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.usersService.deleteUser(id, req.user.role);
  }
}