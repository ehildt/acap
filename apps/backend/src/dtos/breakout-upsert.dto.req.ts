import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsString } from 'class-validator';

import { BreakoutContentUpsertReq } from './breakout-content-upsert.dto.req';

export class BreakoutUpsertReq {
  @IsString()
  @ApiProperty()
  realm: string;

  @ArrayNotEmpty()
  @ApiProperty({ isArray: true, type: () => BreakoutContentUpsertReq })
  contents: Array<BreakoutContentUpsertReq>;
}
