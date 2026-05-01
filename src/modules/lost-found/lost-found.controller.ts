import { Controller, Get, Post, Body } from '@nestjs/common';
import { LostFoundService } from './lost-found.service';

@Controller('lost-found')
export class LostFoundController {
  constructor(private readonly lostFoundService: LostFoundService) {}

  @Get()
  getAllItems() {
    return this.lostFoundService.getAll();
  }

  @Post()
  createItem(@Body() body: any) {
    return this.lostFoundService.create(body);
  }
}