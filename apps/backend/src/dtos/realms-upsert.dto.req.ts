import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsString } from 'class-validator';

import { ContentUpsertReq } from './content-upsert-req.dto';

export class RealmsUpsertReq {
  @IsString()
  @ApiProperty()
  realm: string;

  @ArrayNotEmpty()
  @ApiProperty({ isArray: true, type: () => ContentUpsertReq })
  contents: Array<ContentUpsertReq>;
}
