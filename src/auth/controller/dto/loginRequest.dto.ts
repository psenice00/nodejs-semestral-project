import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ example: 'name@email.com' })
  @IsDefined()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'password123' })
  @IsDefined()
  @IsString()
  readonly password: string;
}
