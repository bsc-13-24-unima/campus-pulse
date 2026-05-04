import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { Claim } from '../lost-found/entities/claim.entity';
import { LostFoundItem } from '../lost-found/entities/lost-found-item.entity';
import { Announcement } from '../announcements/entities/announcement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Claim, LostFoundItem, Announcement])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}