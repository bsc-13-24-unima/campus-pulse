import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostFoundItem } from './entities/lost-found-item.entity';
import { Claim } from './claims/claim.entity';

@Injectable()
export class LostFoundService {
  constructor(
    @InjectRepository(LostFoundItem)
    private readonly lostFoundRepository: Repository<LostFoundItem>,

    @InjectRepository(Claim)
    private readonly claimsRepository: Repository<Claim>,
  ) {}

  async create(data: any) {
    const item = this.lostFoundRepository.create({
      title: data.title,
      description: data.description,
      category: data.category,
      itemType: data.itemType,
      locationInfo: data.locationInfo,
      status: data.status || 'active',
      postedByUserId: data.postedByUserId,
      photoUrl: data.photoUrl,
      verificationQuestion: data.verificationQuestion,
      verificationAnswerHash: data.verificationAnswerHash,
    });

    return this.lostFoundRepository.save(item);
  }

  async getAll() {
    return this.lostFoundRepository.find({
      where: { status: 'active' },
    });
  }

  async getOne(id: number) {
    const item = await this.lostFoundRepository.findOne({
      where: { itemId: id },
    });

    if (!item) {
      throw new NotFoundException('Lost or found item not found');
    }

    return item;
  }

  async update(id: number, data: any) {
    const item = await this.getOne(id);

    item.title = data.title ?? item.title;
    item.description = data.description ?? item.description;
    item.category = data.category ?? item.category;
    item.itemType = data.itemType ?? item.itemType;
    item.locationInfo = data.locationInfo ?? item.locationInfo;
    item.status = data.status ?? item.status;
    item.photoUrl = data.photoUrl ?? item.photoUrl;
    item.verificationQuestion = data.verificationQuestion ?? item.verificationQuestion;
    item.verificationAnswerHash = data.verificationAnswerHash ?? item.verificationAnswerHash;

    return this.lostFoundRepository.save(item);
  }

  async delete(id: number) {
    const item = await this.getOne(id);

    item.status = 'archived';
    item.archivedAt = new Date();

    await this.lostFoundRepository.save(item);

    return {
      message: 'Lost or found item archived successfully',
      itemId: id,
    };
  }

  async createClaim(itemId: number, data: any) {
    await this.getOne(itemId);

    const claim = this.claimsRepository.create({
      itemId,
      claimedByUserId: data.claimedByUserId,
      claimStatus: 'pending',
      reviewerNotes: data.reviewerNotes,
    });

    return this.claimsRepository.save(claim);
  }

  async getAllClaims() {
    return this.claimsRepository.find();
  }

  async getOneClaim(id: number) {
    const claim = await this.claimsRepository.findOne({
      where: { claimId: id },
    });

    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    return claim;
  }

  async reviewClaim(id: number, data: any) {
    const claim = await this.getOneClaim(id);

    claim.claimStatus = data.claimStatus;
    claim.reviewerNotes = data.reviewerNotes ?? claim.reviewerNotes;
    claim.reviewedByUserId = data.reviewedByUserId;
    claim.reviewedAt = new Date();

    return this.claimsRepository.save(claim);
  }
}