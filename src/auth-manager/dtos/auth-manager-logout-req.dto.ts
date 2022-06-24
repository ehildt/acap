import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthManagerLogoutReq {
  constructor(copy?: AuthManagerLogoutReq) {
    Object.assign(this, copy);
  }

  @IsEmail()
  @ApiProperty({ example: 'some@email.com' })
  email: string;
}
