import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUserById(userId: number): Promise<object> {
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');
    return {
      userId: user.userId, fullName: user.fullName,
      email: user.email, role: user.role,
      isActive: user.isActive, createdAt: user.createdAt,
    };
  }

  async updateUser(userId: number, updateData: { name?: string; faculty?: string; year?: number }): Promise<object> {
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');

    if (updateData.name) user.fullName = updateData.name;
    await this.usersRepository.save(user);
    return { message: 'Profile updated successfully' };
  }

  async deleteUser(userId: number, requestingUserRole: string): Promise<object> {
    if (requestingUserRole !== 'admin') {
      throw new ForbiddenException('Only administrators can delete user accounts');
    }
    const user = await this.usersRepository.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.usersRepository.remove(user);
    return { message: `User account ${user.fullName} has been deleted` };
  }
}