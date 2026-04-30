import { Injectable } from '@nestjs/common';

@Injectable()
export class AnnouncementsService {
  private announcements = [];

  getAll() {
    return this.announcements;
  }

  create(data: any) {
    this.announcements.push(data);
    return { message: 'Announcement created', data };
  }
}