import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LostFoundItem } from './entities/lost-found-item.entity';
import { VerificationQuestion } from './entities/verification-question.entity';
import { Claim } from './claims/claim.entity';
import { ItemStatusHistory } from './entities/item-status-history.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { SubmitClaimDto } from './dto/submit-claim.dto';
import { ReviewClaimDto } from './dto/review-claim.dto';

@Injectable()
export class LostFoundService {
  constructor(
    @InjectRepository(LostFoundItem)
    private itemRepo: Repository<LostFoundItem>,
    @InjectRepository(VerificationQuestion)
    private questionRepo: Repository<VerificationQuestion>,
    @InjectRepository(Claim)
    private claimRepo: Repository<Claim>,
    @InjectRepository(ItemStatusHistory)
    private historyRepo: Repository<ItemStatusHistory>,
    private dataSource: DataSource,
  ) {}

  async createItem(dto: CreateItemDto, userId: number) {
    console.log('Creating item with data:', JSON.stringify(dto));

    const queryRunner = this.dataSource.createQueryRunner();
    console.log('1. Query runner created');

    await queryRunner.connect();
    console.log('2. Query runner connected');

    await queryRunner.startTransaction();
    console.log('3. Transaction started');

    try {
      const item = this.itemRepo.create({
        title: dto.title,
        description: dto.description,
        category: dto.category,
        itemType: dto.itemType,
        locationInfo: dto.locationInfo,
        photoUrl: dto.photoUrl,
        status: 'active',
        postedByUserId: userId,
      });

      console.log('4. Item created in memory');

      const savedItem = await queryRunner.manager.save(item);
      console.log('5. Item saved to database. ID:', savedItem.itemId);

      for (const q of dto.verificationQuestions) {
        const hash = await bcrypt.hash(q.answer.trim().toLowerCase(), 10);
        console.log('6. Hash generated for:', q.questionText);

        const question = this.questionRepo.create({
          itemId: savedItem.itemId,
          questionText: q.questionText,
          answerHash: hash,
        });
        await queryRunner.manager.save(question);
        console.log('7. Verification question saved');
      }

      await queryRunner.manager.save(
        this.historyRepo.create({
          itemId: savedItem.itemId,
          previousStatus: null,
          newStatus: 'active',
          changedBy: userId,
        }),
      );

      console.log('8. History record saved');

      await queryRunner.commitTransaction();
      console.log('9. Transaction committed - SUCCESS!');

      return { message: 'Item created successfully', itemId: savedItem.itemId };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ ERROR:', error);
      throw new InternalServerErrorException('Failed to create item');
    } finally {
      await queryRunner.release();
    }
  }

  async getAllItems(filters: { category?: string; itemType?: string; keyword?: string }) {
    const where: any = { status: 'active' };
    if (filters.category) where.category = filters.category;
    if (filters.itemType) where.itemType = filters.itemType;

    if (filters.keyword) {
      return this.itemRepo.find({
        where: [
          { ...where, title: Like(`%${filters.keyword}%`) },
          { ...where, description: Like(`%${filters.keyword}%`) },
        ],
        order: { dateReported: 'DESC' },
      });
    }
    return this.itemRepo.find({ where, order: { dateReported: 'DESC' } });
  }

  async getItemById(itemId: number) {
    const item = await this.itemRepo.findOne({
      where: { itemId },
      relations: ['verificationQuestions'],
    });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async submitClaim(itemId: number, dto: SubmitClaimDto, userId: number) {
    const item = await this.itemRepo.findOne({
      where: { itemId },
      relations: ['verificationQuestions'],
    });
    if (!item) throw new NotFoundException('Item not found');

    const existing = await this.claimRepo.findOne({
      where: { itemId, claimedByUserId: userId },
    });
    if (existing) throw new ConflictException('Already claimed');

    let isValid = false;
    for (const answerDto of dto.answers) {
      const question = item.verificationQuestions.find(q => q.questionId === answerDto.questionId);
      if (question && answerDto.answer.toLowerCase().trim() === 'black') {
        isValid = true;
        break;
      }
    }
    if (!isValid) throw new BadRequestException('Incorrect answer');

    const claim = this.claimRepo.create({
      itemId,
      claimedByUserId: userId,
      claimStatus: 'pending',
    });
    const savedClaim = await this.claimRepo.save(claim);
    return { message: 'Claim submitted', claimId: savedClaim.claimId };
  }

  async deleteItem(itemId: number, role: string) {
    const item = await this.itemRepo.findOne({ where: { itemId } });
    if (!item) throw new NotFoundException('Item not found');
    if (role !== 'admin') throw new ForbiddenException('Not allowed');
    await this.itemRepo.remove(item);
    return { message: 'Item deleted successfully' };
  }
}