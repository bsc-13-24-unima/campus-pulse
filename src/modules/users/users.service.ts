import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [];

  getAll() {
    return this.users;
  }

  create(data: any) {
    this.users.push(data);
    return { message: 'User created', data };
  }
}