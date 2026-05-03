import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getSystemStats();
  }

  @Get('users')
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.adminService.getAllUsers(Number(page), Number(limit));
  }

  @Put('users/:id/deactivate')
  async deactivateUser(@Param('id', ParseIntPipe) userId: number) {
    return this.adminService.deactivateUser(userId);
  }

  @Put('users/:id/activate')
  async activateUser(@Param('id', ParseIntPipe) userId: number) {
    return this.adminService.activateUser(userId);
  }

  @Get('claims/pending')
  async getPendingClaims() {
    return this.adminService.getPendingClaims();
  }

  @Put('claims/:id/review')
  async reviewClaim(
    @Param('id', ParseIntPipe) claimId: number,
    @Body('decision') decision: string,
    @Body('reviewerNotes') reviewerNotes: string,
    @Request() req,
  ) {
    return this.adminService.reviewClaim(claimId, decision, reviewerNotes, req.user.userId);
  }
}