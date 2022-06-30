import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../constants/role.enum';

export class AuthManagerElevateReq {
  constructor(copy?: AuthManagerElevateReq) {
    Object.assign(this, copy);
  }

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({ example: Role.member })
  username: string;

  @IsEmail()
  @ApiProperty({ example: 'some@member.com' })
  email: string;
}
