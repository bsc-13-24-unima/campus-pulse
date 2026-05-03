import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { LostFoundService } from './lost-found.service';

@Controller('lost-found')
export class LostFoundController {
  constructor(private readonly lostFoundService: LostFoundService) {}

  // ===== ITEMS =====
  @Post()
  createItem(@Body() body: any) {
    return this.lostFoundService.create(body);
  }

  @Get()
  getAllItems() {
    return this.lostFoundService.getAll();
  }

  @Get(':id')
  getOneItem(@Param('id') id: string) {
    return this.lostFoundService.getOne(Number(id));
  }

  @Patch(':id')
  updateItem(@Param('id') id: string, @Body() body: any) {
    return this.lostFoundService.update(Number(id), body);
  }

  @Delete(':id')
  deleteItem(@Param('id') id: string) {
    return this.lostFoundService.delete(Number(id));
  }

  // ===== CLAIMS =====
  @Post(':id/claim')
  createClaim(@Param('id') id: string, @Body() body: any) {
    return this.lostFoundService.createClaim(Number(id), body);
  }

  @Get('claims/all')
  getAllClaims() {
    return this.lostFoundService.getAllClaims();
  }

  @Get('claims/:id')
  getOneClaim(@Param('id') id: string) {
    return this.lostFoundService.getOneClaim(Number(id));
  }

  @Patch('claims/:id/review')
  reviewClaim(@Param('id') id: string, @Body() body: any) {
    return this.lostFoundService.reviewClaim(Number(id), body);
  }
}