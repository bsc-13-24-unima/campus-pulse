import { Injectable } from '@nestjs/common';
import { ItemStatus } from './enums/item-status.enum';

@Injectable()
export class LostFoundStatusService {

  async transition(queryRunner, item, newStatus: ItemStatus, userId: number, note: string) {

    const previousStatus = item.status;

    item.status = newStatus;
    await queryRunner.manager.save(item);

    await queryRunner.manager.save('item_status_history', {
      itemId: item.itemId,
      previousStatus,
      newStatus,
      changedBy: userId,
      changeNote: note,
    });
  }
}
