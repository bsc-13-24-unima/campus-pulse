import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('LOST_FOUND_ITEMS')
export class LostFoundItem {
  @PrimaryGeneratedColumn({ name: 'ITEM_ID' })
  itemId: number;

  @Column({ name: 'TITLE', type: 'varchar2', length: 255 })
  title: string;

  @Column({ name: 'DESCRIPTION', type: 'clob' })
  description: string;

  @Column({ name: 'CATEGORY', type: 'varchar2', length: 100 })
  category: string;

  @Column({ name: 'ITEM_TYPE', type: 'varchar2', length: 10 })
  itemType: string;

  @Column({ name: 'LOCATION_INFO', type: 'varchar2', length: 255, nullable: true })
  locationInfo: string;

  @Column({ name: 'STATUS', type: 'varchar2', length: 50, default: 'active' })
  status: string;

  @Column({ name: 'POSTED_BY_USER_ID', type: 'number' })
  postedByUserId: number;

  @Column({ name: 'PHOTO_URL', type: 'varchar2', length: 500, nullable: true })
  photoUrl: string;

  @Column({ name: 'VERIFICATION_QUESTION', type: 'varchar2', length: 500 })
  verificationQuestion: string;

  @Column({ name: 'VERIFICATION_ANSWER_HASH', type: 'varchar2', length: 255 })
  verificationAnswerHash: string;

  @Column({ name: 'DATE_REPORTED', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateReported: Date;

  @Column({ name: 'ARCHIVED_AT', type: 'timestamp', nullable: true })
  archivedAt: Date;
}