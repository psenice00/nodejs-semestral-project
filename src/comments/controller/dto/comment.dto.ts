import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CommentDto {
  @ApiProperty({ example: '1234-1234-1234' })
  @Expose()
  @IsUUID(4)
  id: string;

  @ApiProperty()
  @Expose()
  @IsString()
  text: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  votes: number;
}
