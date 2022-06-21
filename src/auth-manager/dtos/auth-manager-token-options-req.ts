import { IsNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthManagerTokenOptionsReq {
  constructor(copy?: AuthManagerTokenOptionsReq) {
    Object.assign(this, copy);
  }

  @MinLength(1)
  @IsString({ each: true })
  @ApiProperty()
  audience: string[];

  @IsNumber()
  @ApiPropertyOptional()
  expiresIn?: number;
}
