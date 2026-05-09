import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LostFoundItem } from '../lost-found/entities/lost-found-item.entity';
import { Claim } from '../lost-found/claims/claim.entity';
import { Announcement } from '../announcements/entities/announcement.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(LostFoundItem)
    private itemsRepository: Repository<LostFoundItem>,
    @InjectRepository(Claim)
    private claimsRepository: Repository<Claim>,
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
  ) {}

  async getDashboard() {
    const users = await this.usersRepository.count();
    const items = await this.itemsRepository.count();
    const claims = await this.claimsRepository.count();
    const announcements = await this.announcementsRepository.count();

    return {
      totalUsers: users,
      totalItems: items,
      totalClaims: claims,
      totalAnnouncements: announcements,
    };
  }
}