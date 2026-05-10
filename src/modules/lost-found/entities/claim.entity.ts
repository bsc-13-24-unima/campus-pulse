import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('claims')
export class Claim {
  @PrimaryGeneratedColumn()
  claimId: number;

  @Column()
  itemId: number;

  @Column()
  claimedByUserId: number;

  @Column({ default: 'pending' })
  claimStatus: string;

  @CreateDateColumn()
  submittedAt: Date;

  @Column({ nullable: true })
  reviewedAt: Date;

  @Column({ nullable: true })
  reviewerNotes: string;

  @Column({ nullable: true })
  reviewedByUserId: number;
}