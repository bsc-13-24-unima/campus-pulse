import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ANNOUNCEMENTS')
export class Announcement {
  @PrimaryGeneratedColumn({ name: 'ANNOUNCEMENT_ID' })
  announcementId: number;

  @Column({ name: 'TITLE', type: 'varchar2', length: 255 })
  title: string;

  @Column({ name: 'CONTENT', type: 'clob' })
  content: string;

  @Column({ name: 'POSTED_BY_USER_ID', type: 'number' })
  postedByUserId: number;

  @Column({ name: 'TARGET_AUDIENCE', type: 'varchar2', length: 50, default: 'all' })
  targetAudience: string;

  @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
  isActive: number;

  @Column({ name: 'CREATED_AT', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}