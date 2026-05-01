import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('announcements')
export class AnnouncementsController {

  @Get()
  findAll() {
    return [];
  }

  @Post()
  create(@Body() body: any) {
    return {
      message: 'Announcement created',
      data: body
    };
  }
}