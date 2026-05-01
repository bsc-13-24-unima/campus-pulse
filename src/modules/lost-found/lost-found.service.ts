import { Injectable } from '@nestjs/common';

@Injectable()
export class LostFoundService {
  private items = [];

  getAll() {
    return this.items;
  }

  create(data: any) {
    this.items.push(data);
    return { message: 'Item added', data };
  }
}