import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  createAnnouncement(@Body() body: any) {
    return this.announcementsService.create(body);
  }

  @Get()
  getAllAnnouncements() {
    return this.announcementsService.getAll();
  }

  @Get(':id')
  getOneAnnouncement(@Param('id') id: string) {
    return this.announcementsService.getOne(Number(id));
  }

  @Patch(':id')
  updateAnnouncement(@Param('id') id: string, @Body() body: any) {
    return this.announcementsService.update(Number(id), body);
  }

  @Delete(':id')
  deleteAnnouncement(@Param('id') id: string) {
    return this.announcementsService.delete(Number(id));
  }
}