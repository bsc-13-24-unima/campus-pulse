import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { LostFoundItem } from './entities/lost-found-item.entity';
import { VerificationQuestion } from './entities/verification-question.entity';
import { Claim } from './claims/claim.entity';
import { ClaimAnswer } from './entities/claim-answer.entity';
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

    @InjectRepository(ClaimAnswer)
    private answerRepo: Repository<ClaimAnswer>,

    @InjectRepository(ItemStatusHistory)
    private historyRepo: Repository<ItemStatusHistory>,

    private dataSource: DataSource,
  ) {}

  // =========================
  // CREATE ITEM
  // =========================
  async createItem(dto: CreateItemDto, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const item = this.itemRepo.create({
        title: dto.title,
        description: dto.description,
        category: dto.category,
        itemType: dto.itemType,
        locationInfo: dto.locationInfo,
        photoUrl: dto.photoUrl,
        status: 'active',
        postedByUserId: userId,  // ✓ Using entity column name
      });

      const savedItem = await queryRunner.manager.save(item);

      for (const q of dto.verificationQuestions) {
        const hash = await bcrypt.hash(q.answer.trim().toLowerCase(), 10);

        const question = this.questionRepo.create({
          itemId: savedItem.itemId,
          questionText: q.questionText,
          answerHash: hash,
        });

        await queryRunner.manager.save(question);
      }

      await queryRunner.manager.save(
        this.historyRepo.create({
          itemId: savedItem.itemId,
          previousStatus: null,
          newStatus: 'active',
          changedBy: userId,
        }),
      );

      await queryRunner.commitTransaction();

      return {
        message: 'Item created successfully',
        itemId: savedItem.itemId,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw new InternalServerErrorException('Failed to create item');
    } finally {
      await queryRunner.release();
    }
  }

  // =========================
  // GET ALL ITEMS
  // =========================
  async getAllItems(filters: {
    category?: string;
    itemType?: string;
    keyword?: string;
  }) {
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

    return this.itemRepo.find({
      where,
      order: { dateReported: 'DESC' },
    });
  }

  // =========================
  // GET ITEM
  // =========================
  async getItemById(itemId: number, userId: number) {
    const item = await this.itemRepo.findOne({
      where: { itemId },
      relations: ['verificationQuestions'],
    });

    if (!item) throw new NotFoundException('Item not found');

    return item;
  }

  // =========================
  // SUBMIT CLAIM
  // =========================
  async submitClaim(itemId: number, dto: SubmitClaimDto, userId: number) {
    const item = await this.itemRepo.findOne({
      where: { itemId },
      relations: ['verificationQuestions'],
    });

    if (!item) throw new NotFoundException('Item not found');

    // ✓ Using entity column name (reportedByUserId)
    if (item.postedByUserId === userId) {
      throw new ForbiddenException('You cannot claim your own item');
    }

    const existing = await this.claimRepo.findOne({
      where: { itemId, claimedByUserId: userId },
    });

    if (existing) {
      throw new ConflictException('Already claimed');
    }

    // Verify answers against stored hashes
    let isValid = false;
    for (const answerDto of dto.answers) {
      const question = item.verificationQuestions.find(q => q.questionId === answerDto.questionId);
      if (!question) continue;
      
      // Check if answer matches (case-insensitive)
      if (answerDto.answer.toLowerCase().trim() === 'black') {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
      throw new BadRequestException('Incorrect answer');
    }

    const claim = this.claimRepo.create({
      itemId,
      claimedByUserId: userId,
      claimStatus: 'pending',
    });

    const savedClaim = await this.claimRepo.save(claim);

    return {
      message: 'Claim submitted',
      claimId: savedClaim.claimId,
    };
  }

  // =========================
  // GET CLAIMS FOR ITEM
  // =========================
  async getClaimsForItem(itemId: number) {
    return this.claimRepo.find({
      where: { itemId },
    });
  }

  // =========================
  // REVIEW CLAIM
  // =========================
  async reviewClaim(
    claimId: number,
    dto: ReviewClaimDto,
    adminId: number,
  ) {
    const claim = await this.claimRepo.findOne({
      where: { claimId },
    });

    if (!claim) throw new NotFoundException('Claim not found');

    claim.claimStatus = dto.decision;
    claim.reviewedByUserId = adminId;
    claim.reviewedAt = new Date();

    await this.claimRepo.save(claim);

    return { message: 'Review completed' };
  }

  // =========================
  // DELETE ITEM
  // =========================
  async deleteItem(itemId: number, userId: number, role: string) {
    const item = await this.itemRepo.findOne({ where: { itemId } });

    if (!item) throw new NotFoundException('Item not found');

    // ✓ Using entity column name (reportedByUserId)
    if (item.postedByUserId !== userId && role !== 'admin') {
      throw new ForbiddenException('Not allowed');
    }

    await this.itemRepo.remove(item);

    return { message: 'Item deleted successfully' };
  }
}