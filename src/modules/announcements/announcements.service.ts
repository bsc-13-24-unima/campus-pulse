import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
  ) {}

  async getAllAnnouncements(audience?: string): Promise<object[]> {
    const queryBuilder = this.announcementsRepository
      .createQueryBuilder('announcement')
      .leftJoinAndSelect('announcement.postedBy', 'user')
      .where('announcement.isActive = :isActive', { isActive: 1 })
      .orderBy('announcement.createdAt', 'DESC');

    if (audience && audience !== 'all') {
      queryBuilder.andWhere(
        '(announcement.targetAudience = :audience OR announcement.targetAudience = :all)',
        { audience, all: 'all' }
      );
    }

    const announcements = await queryBuilder.getMany();

    return announcements.map(a => ({
      announcementId: a.announcementId,
      title: a.title,
      content: a.content,
      targetAudience: a.targetAudience,
      createdAt: a.createdAt,
      postedBy: {
        fullName: a.postedBy ? a.postedBy.fullName : 'System',
      },
    }));
  }

  async createAnnouncement(
    createDto: CreateAnnouncementDto,
    userId: number,
  ): Promise<object> {
    const newAnnouncement = this.announcementsRepository.create({
      title: createDto.title,
      content: createDto.content,
      targetAudience: createDto.targetAudience,
      postedByUserId: userId,
      isActive: 1,
    });

    const saved = await this.announcementsRepository.save(newAnnouncement);

    return {
      message: 'Announcement created successfully',
      announcementId: saved.announcementId,
    };
  }

  async updateAnnouncement(
    announcementId: number,
    updateDto: UpdateAnnouncementDto,
  ): Promise<object> {
    const announcement = await this.announcementsRepository.findOne({
      where: { announcementId },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    if (updateDto.title) announcement.title = updateDto.title;
    if (updateDto.content) announcement.content = updateDto.content;
    if (updateDto.targetAudience) announcement.targetAudience = updateDto.targetAudience;
    if (updateDto.isActive !== undefined) announcement.isActive = updateDto.isActive;

    await this.announcementsRepository.save(announcement);

    return { message: 'Announcement updated successfully' };
  }

  async deleteAnnouncement(announcementId: number): Promise<object> {
    const announcement = await this.announcementsRepository.findOne({
      where: { announcementId },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    await this.announcementsRepository.remove(announcement);

    return { message: 'Announcement deleted successfully' };
  }
}