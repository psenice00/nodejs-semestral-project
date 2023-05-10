import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString, IsUUID } from 'class-validator';

@Exclude()
export class UserDto {
  @ApiProperty({ example: '1234-1234-1234' })
  @Expose()
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'name@email.com' })
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'name' })
  @Expose()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'surname' })
  @Expose()
  @IsString()
  lastName: string;
}
