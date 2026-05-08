import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('USERS')
export class User {
  @PrimaryGeneratedColumn({ name: 'USER_ID' })
  userId: number;

  @Column({ name: 'FULL_NAME', type: 'varchar2', length: 255 })
  fullName: string;

  @Column({ name: 'EMAIL', type: 'varchar2', length: 255, unique: true })
  email: string;

  @Column({ name: 'PASSWORD_HASH', type: 'varchar2', length: 255 })
  passwordHash: string;

  @Column({ name: 'ROLE', type: 'varchar2', length: 50, default: 'student' })
  role: string;

  @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
  isActive: number;

  @Column({ name: 'CREATED_AT', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}