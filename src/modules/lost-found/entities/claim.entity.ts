import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { LostFoundItem } from './lost-found-item.entity';

@Entity('claims')
export class Claim {

  @PrimaryGeneratedColumn()
  claimId: number;

  @Column()
  itemId: number;

  @Column()
  claimantUserId: number;

  @Column({ default: 'pending' })
  claimStatus: 'pending' | 'verified' | 'approved' | 'rejected';

  @CreateDateColumn()
  submittedAt: Date;

  // ✅ ADD THIS (this is what fixes your red line)
  @Column({ nullable: true })
  verifiedAt: Date;

  // ✅ ADD THIS (THIS IS THE EXACT FIELD CAUSING YOUR ERROR)
  @Column({ nullable: true })
  reviewedAt: Date;

  @Column({ nullable: true })
  reviewedByUserId: number;

  @Column({ nullable: true })
  rejectionReason: string;

  @ManyToOne(() => LostFoundItem, item => item.claims, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  item: LostFoundItem;
}