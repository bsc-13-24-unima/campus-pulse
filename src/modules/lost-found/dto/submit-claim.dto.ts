import { IsArray, ValidateNested, IsNumber, IsString, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerDto {
  @IsNumber()
  questionId: number;

  @IsString()
  answer: string;
}

export class SubmitClaimDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}