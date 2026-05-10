import { IsString, IsNotEmpty, IsIn, IsOptional, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class VerificationQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsIn(['lost', 'found'])
  itemType: string;

  @IsString()
  @IsOptional()
  locationInfo: string;

  @IsString()
  @IsOptional()
  photoUrl: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => VerificationQuestionDto)
  verificationQuestions: VerificationQuestionDto[];
}