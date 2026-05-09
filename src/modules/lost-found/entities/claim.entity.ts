import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { LostFoundItem } from './lost-found-item.entity';

@Entity('claims')
export class Claim {
  @PrimaryGeneratedColumn({ name: 'claim_id' })
  claimId: number;

  @Column({ name: 'item_id' })
  itemId: number;

  @Column({ name: 'claimed_by_user_id' })
  claimedByUserId: number;

  @Column({ name: 'claim_status', length: 30, default: 'pending' })
  claimStatus: string;

  @Column({ name: 'reviewer_notes', length: 500, nullable: true })
  reviewerNotes: string;

  @Column({ name: 'reviewed_by_user_id', nullable: true })
  reviewedByUserId: number;

  @CreateDateColumn({ name: 'submitted_at' })
  submittedAt: Date;

  @Column({ name: 'reviewed_at', type: 'date', nullable: true })
  reviewedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'claimed_by_user_id' })
  claimedBy: User;

  @ManyToOne(() => LostFoundItem)
  @JoinColumn({ name: 'item_id' })
  item: LostFoundItem;
}