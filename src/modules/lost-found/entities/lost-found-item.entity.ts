import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

import { VerificationQuestion } from './verification-question.entity';
import { ItemStatusHistory } from './item-status-history.entity';

@Entity('lost_found_items')
export class LostFoundItem {
  @PrimaryGeneratedColumn()
  itemId: number;

  @Column()
  title: string;

  @Column({ type: 'clob' })
  description: string;

  @Column()
  category: string;

  @Column()
  itemType: string;

  @Column()
  locationInfo: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  dateReported: Date;

  @Column({ nullable: true })
  dateResolved: Date;

  @OneToMany(() => VerificationQuestion, q => q.item)
  verificationQuestions: VerificationQuestion[];

  @OneToMany(() => ItemStatusHistory, h => h.item)
  statusHistory: ItemStatusHistory[];

  @Column()
  postedByUserId: number;
}