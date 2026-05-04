import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('lost_found_items')
export class LostFoundItem {
  @PrimaryGeneratedColumn({ name: 'item_id' })
  itemId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 50 })
  category: string;

  @Column({ name: 'item_type', length: 10 })
  itemType: string;

  @Column({ length: 20, default: 'active' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}