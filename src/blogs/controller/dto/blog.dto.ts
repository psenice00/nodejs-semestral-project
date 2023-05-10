import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class BlogDto {
  @ApiProperty({ example: '1234-1234-1234' })
  @Expose()
  @IsUUID(4)
  id: string;

  @ApiProperty({ example: 'Blog title' })
  @Expose()
  @IsString()
  @MaxLength(128)
  title: string;

  @ApiProperty()
  @Expose()
  @IsString()
  text: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
