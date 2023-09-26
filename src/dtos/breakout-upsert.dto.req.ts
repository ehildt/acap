import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsString } from 'class-validator';

import { JobUpsertReq } from './breakout-job-upsert.dto.req';

export class BreakoutUpsertReq {
  @IsString()
  @ApiProperty()
  channel: string;

  @ArrayNotEmpty()
  @ApiProperty({ isArray: true, type: () => JobUpsertReq })
  jobs: Array<JobUpsertReq>;
}
