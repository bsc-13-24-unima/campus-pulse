import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { LostFoundService } from './lost-found.service';

import { CreateItemDto } from './dto/create-item.dto';
import { SubmitClaimDto } from './dto/submit-claim.dto';
import { ReviewClaimDto } from './dto/review-claim.dto';

@Controller('lost-found')
export class LostFoundController {
  constructor(private readonly service: LostFoundService) {}

  // =====================================================
  // 1. CREATE ITEM
  // =====================================================
  @Post()
  createItem(@Body() body: CreateItemDto) {
    const fakeUserId = 1;
    return this.service.createItem(body, fakeUserId);
  }

  // =====================================================
  // 2. GET ALL ITEMS
  // =====================================================
  @Get()
  getAll(
    @Query('category') category?: string,
    @Query('itemType') itemType?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.service.getAllItems({ category, itemType, keyword });
  }

  // =====================================================
  // 3. GET ITEM BY ID
  // =====================================================
  @Get(':id')
  getOne(@Param('id') id: string) {
    const fakeUserId = 1;
    return this.service.getItemById(Number(id), fakeUserId);
  }

  // =====================================================
  // 4. SUBMIT CLAIM
  // =====================================================
  @Post(':id/claim')
  submitClaim(
    @Param('id') id: string,
    @Body() body: SubmitClaimDto,
  ) {
    const fakeUserId = 1;
    return this.service.submitClaim(Number(id), body, fakeUserId);
  }

  // =====================================================
  // 5. ADMIN REVIEW
  // =====================================================
  @Post('claim/:claimId/review')
  review(
    @Param('claimId') claimId: string,
    @Body() body: ReviewClaimDto,
  ) {
    const adminId = 999;
    return this.service.reviewClaim(Number(claimId), body, adminId);
  }

  // =====================================================
  // 6. DELETE ITEM
  // =====================================================
  @Delete(':id')
  delete(@Param('id') id: string) {
    const fakeUserId = 1;
    const role = 'admin';
    return this.service.deleteItem(Number(id), fakeUserId, role);
  }
}
