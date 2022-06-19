import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthManagerSignupReq {
  constructor(copy?: AuthManagerSignupReq) {
    Object.assign(this, copy);
  }

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;
}
