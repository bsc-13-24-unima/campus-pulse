import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateAnnouncementDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Content is required' })
  @IsString()
  content: string;

  @IsIn(['all', 'students', 'staff'], { message: 'Target audience must be all, students, or staff' })
  targetAudience: string;
}