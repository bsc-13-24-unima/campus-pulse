import { Controller, Get, Post, Body } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  getAll() {
    return this.announcementsService.getAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.announcementsService.create(body);
  }
}