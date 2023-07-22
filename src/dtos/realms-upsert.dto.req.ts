import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsString, IsUppercase } from 'class-validator';

import { ContentUpsertReq } from './content-upsert-req.dto';

export class RealmsUpsertReq {
  @IsString()
  @IsUppercase()
  @ApiProperty()
  realm: string;

  @ArrayNotEmpty()
  @ApiProperty({ isArray: true, type: () => ContentUpsertReq })
  configs: Array<ContentUpsertReq>;
}
