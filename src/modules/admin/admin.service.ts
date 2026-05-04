import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Claim } from '../lost-found/entities/claim.entity';
import { LostFoundItem } from '../lost-found/entities/lost-found-item.entity';
import { Announcement } from '../announcements/entities/announcement.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Claim)
    private claimsRepository: Repository<Claim>,
    @InjectRepository(LostFoundItem)
    private itemsRepository: Repository<LostFoundItem>,
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
  ) {}

  async getAllUsers(page: number = 1, limit: number = 20): Promise<object> {
    const skip = (page - 1) * limit;
    const [users, total] = await this.usersRepository.findAndCount({
      skip, take: limit, order: { createdAt: 'DESC' },
    });
    return {
      data: users.map(u => ({
        userId: u.userId, fullName: u.fullName,
        email: u.email, role: u.role,
        isActive: u.isActive, createdAt: u.createdAt,
      })),
      total, page, limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deactivateUser(userId: number): Promise<object> {
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');
    user.isActive = 0;
    await this.usersRepository.save(user);
    return { message: `User ${user.fullName} has been deactivated` };
  }

  async activateUser(userId: number): Promise<object> {
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');
    user.isActive = 1;
    await this.usersRepository.save(user);
    return { message: `User ${user.fullName} has been activated` };
  }

  async getPendingClaims(): Promise<object[]> {
    const claims = await this.claimsRepository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim.item', 'item')
      .leftJoinAndSelect('claim.claimedBy', 'claimant')
      .where('claim.claimStatus = :status', { status: 'verified-pending-approval' })
      .orderBy('claim.submittedAt', 'ASC')
      .getMany();

    return claims.map(c => ({
      claimId: c.claimId,
      submittedAt: c.submittedAt,
      item: {
        itemId: c.item?.itemId, title: c.item?.title || 'Unknown',
        category: c.item?.category || 'Unknown', itemType: c.item?.itemType || 'Unknown',
      },
      claimant: {
        userId: c.claimedBy?.userId, fullName: c.claimedBy?.fullName || 'Unknown',
        email: c.claimedBy?.email || 'Unknown',
      },
    }));
  }

  async reviewClaim(claimId: number, decision: string, reviewerNotes: string, reviewerUserId: number): Promise<object> {
    const claim = await this.claimsRepository.findOne({ where: { claimId }, relations: ['item'] });
    if (!claim) throw new NotFoundException('Claim not found');

    claim.claimStatus = decision === 'approved' ? 'approved' : 'rejected';
    claim.reviewedAt = new Date();
    claim.reviewerNotes = reviewerNotes || '';
    claim.reviewedByUserId = reviewerUserId;
    await this.claimsRepository.save(claim);

    if (decision === 'approved' && claim.item) {
      claim.item.status = 'claimed';
      await this.itemsRepository.save(claim.item);
    }
    return { message: `Claim has been ${claim.claimStatus}`, claimId };
  }

  async getSystemStats(): Promise<object> {
    const totalUsers = await this.usersRepository.count();
    const activeUsers = await this.usersRepository.count({ where: { isActive: 1 } });
    const activeItems = await this.itemsRepository.count({ where: { status: 'active' } });
    const pendingClaims = await this.claimsRepository.count({ where: { claimStatus: 'verified-pending-approval' } });
    const totalAnnouncements = await this.announcementsRepository.count({ where: { isActive: 1 } });

    return {
      totalUsers, activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      activeItems, pendingClaims, totalAnnouncements,
    };
  }
}