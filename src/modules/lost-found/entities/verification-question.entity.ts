import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { LostFoundItem } from './lost-found-item.entity';

@Entity('verification_questions')
export class VerificationQuestion {
  @PrimaryGeneratedColumn()
  questionId: number;

  @Column()
  itemId: number;

  @Column()
  questionText: string;

  @Column()
  answerHash: string;

  @ManyToOne(() => LostFoundItem, item => item.verificationQuestions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  item: LostFoundItem;
}