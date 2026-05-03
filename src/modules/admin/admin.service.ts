import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  getDashboard() {
    return {
      message: 'Admin dashboard working',
      users: 0,
      announcements: 0,
      lostFoundItems: 0,
    };
  }
}