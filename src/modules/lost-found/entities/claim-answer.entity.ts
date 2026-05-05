import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Claim } from './claim.entity';

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

  @ManyToOne(() => Claim, claim => claim.claimId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'claimId' })
  claim: Claim;
}