import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { LostFoundItem } from './lost-found-item.entity';

@Entity('item_status_history')
export class ItemStatusHistory {
  @PrimaryGeneratedColumn()
  historyId: number;

  @Column()
  itemId: number;

  @Column({ nullable: true })
  previousStatus: string;

  @Column()
  newStatus: string;

  @Column()
  changedBy: number;

  @CreateDateColumn()
  changedAt: Date;

  @ManyToOne(() => LostFoundItem, item => item.statusHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  item: LostFoundItem;
}