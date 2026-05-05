import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

import { VerificationQuestion } from './verification-question.entity';
import { Claim } from './claim.entity';
import { ItemStatusHistory } from './item-status-history.entity';

@Entity('lost_found_items')
export class LostFoundItem {
  @PrimaryGeneratedColumn()
  itemId: number;

  @Column()
  title: string;

  // FIXED FOR ORACLE
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

  @Column()
  reportedByUserId: number;

  @Column({ nullable: true })
  contactRevealedTo: number;

  @CreateDateColumn()
  dateReported: Date;

  @Column({ nullable: true })
  dateResolved: Date;

  @OneToMany(() => VerificationQuestion, q => q.item)
  verificationQuestions: VerificationQuestion[];

  @OneToMany(() => Claim, c => c.item)
  claims: Claim[];

  @OneToMany(() => ItemStatusHistory, h => h.item)
  statusHistory: ItemStatusHistory[];
}
