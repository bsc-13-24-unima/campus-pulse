import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LostFoundService } from './lost-found.service';
import { CreateItemDto } from './dto/create-item.dto';
import { SubmitClaimDto } from './dto/submit-claim.dto';
import { ReviewClaimDto } from './dto/review-claim.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('lost-found')
@UseGuards(JwtAuthGuard)
export class LostFoundController {
  constructor(private readonly service: LostFoundService) {}

  @Post()
  createItem(@Body() body: CreateItemDto) {
    console.log('Received body:', JSON.stringify(body));
    return this.service.createItem(body, 1);
  }

  @Get()
  getAll(@Query('category') category?: string, @Query('itemType') itemType?: string, @Query('keyword') keyword?: string) {
    return this.service.getAllItems({ category, itemType, keyword });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.getItemById(Number(id));
  }

  @Post(':id/claim')
  submitClaim(@Param('id') id: string, @Body() body: SubmitClaimDto) {
    return this.service.submitClaim(Number(id), body, 1);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.deleteItem(Number(id), 'admin');
  }
}