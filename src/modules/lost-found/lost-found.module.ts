import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostFoundController } from './lost-found.controller';
import { LostFoundService } from './lost-found.service';
import { LostFoundItem } from './entities/lost-found-item.entity';
import { Claim } from './claims/claim.entity';
import { ClaimAnswer } from './entities/claim-answer.entity';
import { VerificationQuestion } from './entities/verification-question.entity';
import { ItemStatusHistory } from './entities/item-status-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    LostFoundItem, 
    Claim, 
    ClaimAnswer, 
    VerificationQuestion, 
    ItemStatusHistory
  ])],
  controllers: [LostFoundController],
  providers: [LostFoundService],
  exports: [LostFoundService],
})
export class LostFoundModule {}