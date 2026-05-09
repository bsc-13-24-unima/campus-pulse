import { IsOptional, IsString, IsIn, IsNumber } from 'class-validator';

export class UpdateAnnouncementDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsIn(['all', 'students', 'staff'])
  targetAudience: string;

  @IsOptional()
  @IsNumber()
  isActive: number;
}