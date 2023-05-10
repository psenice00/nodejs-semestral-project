import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsDate } from 'class-validator';

export class TokenResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX' })
  @Expose()
  @IsString()
  accessToken: string;

  @ApiProperty({ example: '15m' })
  @Expose()
  @IsDate()
  expiresAt: string;
}
