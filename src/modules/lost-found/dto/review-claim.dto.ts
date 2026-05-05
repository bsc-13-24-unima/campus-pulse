import { IsIn } from 'class-validator';

export class ReviewClaimDto {
  @IsIn(['approved', 'rejected'])
  decision: 'approved' | 'rejected';
}
