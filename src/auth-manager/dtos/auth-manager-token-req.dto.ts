import { IsDefined, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthManagerTokenOptionsReq } from './auth-manager-token-options-req';

export class AuthManagerTokenReq {
  constructor(copy?: AuthManagerTokenReq) {
    Object.assign(this, copy);
  }

  @IsDefined()
  @IsObject()
  @ApiProperty({ type: 'object', title: 'JwtData' })
  jwtData: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  @ApiProperty()
  options?: AuthManagerTokenOptionsReq;
}
