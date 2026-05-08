
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ✅ CREATE
  create(body: any) {
    const user = this.userRepository.create({
      fullName: body.fullName,
      email: body.email,
      passwordHash: body.password,
      role: 'student',
      isActive: 1,
    });

    return this.userRepository.save(user);
  }

  // ✅ GET ALL
  getAll() {
    return this.userRepository.find();
  }

  // ✅ GET ONE
  getOne(id: number) {
    return this.userRepository.findOneBy({ userId: id });
  }

  // ✅ UPDATE
  update(id: number, body: any) {
    return this.userRepository.update(id, body);
  }

  // ✅ DELETE
  delete(id: number) {
    return this.userRepository.delete(id);
  }
}