import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Claim } from '../claims/claim.entity';

@Entity('claim_answers')
export class ClaimAnswer {
  @PrimaryGeneratedColumn()
  answerId: number;

  @Column()
  claimId: number;

  @Column()
  questionId: number;

  @Column()
  answerText: string;

  @Column()
  isCorrect: number;

 @ManyToOne(() => Claim, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'claimId' })
claim: Claim;
}