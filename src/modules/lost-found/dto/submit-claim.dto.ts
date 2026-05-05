import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionAnswerDto {

  @IsNumber()
  questionId: number;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class SubmitClaimDto {

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerDto)
  answers: QuestionAnswerDto[];
}
