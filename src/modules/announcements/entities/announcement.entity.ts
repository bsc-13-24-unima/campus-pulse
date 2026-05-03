import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn({ name: 'announcement_id' })
  announcementId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'clob' })
  content: string;

  @Column({ name: 'posted_by_user_id' })
  postedByUserId: number;

  @Column({ name: 'target_audience', length: 50, default: 'all' })
  targetAudience: string;

  @Column({ name: 'is_active', default: 1 })
  isActive: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'posted_by_user_id' })
  postedBy: User;
}