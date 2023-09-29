import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsString } from 'class-validator';

import { ContentUpsertReq } from './breakout-content-upsert.dto.req';

export class BreakoutUpsertReq {
  @IsString()
  @ApiProperty()
  realm: string;

  @ArrayNotEmpty()
  @ApiProperty({ isArray: true, type: () => ContentUpsertReq })
  contents: Array<ContentUpsertReq>;
}
