import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CommentFilterDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  blogId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  authorId?: string;
}
