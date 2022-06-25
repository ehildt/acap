import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../constants/role.enum';

export class AuthManagerToken {
  constructor(copy?: AuthManagerToken) {
    Object.assign(this, copy);
  }

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '62b5c4467a8dc36f85a18188' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: Role.superadmin })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'some@email.com' })
  email: string;

  @IsEnum(Role)
  @ApiProperty({ example: Role.superadmin })
  role: Role;

  @IsNumber()
  @ApiProperty({ example: 1656085962 })
  iat: number;

  @IsNumber()
  @ApiProperty({ example: 1656086862 })
  exp: number;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: Object })
  configs?: Record<string, unknown>;
}
