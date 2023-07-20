import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsString, IsUppercase } from 'class-validator';

import { RealmUpsertReq } from './realm-upsert-req.dto';

export class RealmsUpsertReq {
  @IsString()
  @IsUppercase()
  @ApiProperty()
  realm: string;

  @ArrayNotEmpty()
  @ApiProperty({ isArray: true, type: () => RealmUpsertReq })
  configs: Array<RealmUpsertReq>;
}
