import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../constants/role.enum';

export class AuthManagerSignupReq {
  constructor(copy?: AuthManagerSignupReq) {
    Object.assign(this, copy);
  }

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({ example: Role.superadmin })
  username: string;

  @IsEmail()
  @ApiProperty({ example: 'super@admin.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({ example: Role.superadmin })
  password: string;
}
