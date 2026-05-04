import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostFoundController } from './lost-found.controller';
import { LostFoundService } from './lost-found.service';
import { LostFoundItem } from './entities/lost-found-item.entity';
import { Claim } from './claims/claim.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LostFoundItem, Claim])],
  controllers: [LostFoundController],
  providers: [LostFoundService],
  exports: [LostFoundService],
})
export class LostFoundModule {}