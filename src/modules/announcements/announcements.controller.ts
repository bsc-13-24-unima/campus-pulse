import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  async getAllAnnouncements(@Query('audience') audience?: string) {
    return this.announcementsService.getAllAnnouncements(audience);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'staff')
  async createAnnouncement(
    @Body() createDto: CreateAnnouncementDto,
    @Request() req,
  ) {
    return this.announcementsService.createAnnouncement(createDto, req.user.userId);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateAnnouncement(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAnnouncementDto,
  ) {
    return this.announcementsService.updateAnnouncement(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async deleteAnnouncement(@Param('id', ParseIntPipe) id: number) {
    return this.announcementsService.deleteAnnouncement(id);
  }
}