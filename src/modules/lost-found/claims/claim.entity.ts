import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('CLAIMS')
export class Claim {
  @PrimaryGeneratedColumn({ name: 'CLAIM_ID' })
  claimId: number;

  @Column({ name: 'ITEM_ID', type: 'number' })
  itemId: number;

  @Column({ name: 'CLAIMED_BY_USER_ID', type: 'number' })
  claimedByUserId: number;

  @Column({ name: 'CLAIM_STATUS', type: 'varchar2', length: 50, default: 'pending' })
  claimStatus: string;

  @Column({ name: 'SUBMITTED_AT', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submittedAt: Date;

  @Column({ name: 'REVIEWED_AT', type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ name: 'REVIEWER_NOTES', type: 'varchar2', length: 1000, nullable: true })
  reviewerNotes: string;

  @Column({ name: 'REVIEWED_BY_USER_ID', type: 'number', nullable: true })
  reviewedByUserId: number;
}