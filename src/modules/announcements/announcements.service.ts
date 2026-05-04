import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementsRepository: Repository<Announcement>,
  ) {}

  async create(data: any) {
    const announcement = this.announcementsRepository.create({
      title: data.title,
      content: data.content,
      postedByUserId: data.postedByUserId,
      targetAudience: data.targetAudience || 'all',
      isActive: data.isActive ?? 1,
    });

    return this.announcementsRepository.save(announcement);
  }

  async getAll() {
    return this.announcementsRepository.find({
      where: { isActive: 1 },
    });
  }

  async getOne(id: number) {
    const announcement = await this.announcementsRepository.findOne({
      where: { announcementId: id },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return announcement;
  }

  async update(id: number, data: any) {
    const announcement = await this.getOne(id);

    announcement.title = data.title ?? announcement.title;
    announcement.content = data.content ?? announcement.content;
    announcement.targetAudience = data.targetAudience ?? announcement.targetAudience;
    announcement.isActive = data.isActive ?? announcement.isActive;

    return this.announcementsRepository.save(announcement);
  }

  async delete(id: number) {
    const announcement = await this.getOne(id);

    announcement.isActive = 0;

    await this.announcementsRepository.save(announcement);

    return {
      message: 'Announcement deactivated successfully',
      announcementId: id,
    };
  }
}