import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsString, IsUppercase } from 'class-validator';

import { ConfigManagerUpsertReq } from './config-manager-upsert-req.dto';

export class ConfigManagerUpsertRealmReq {
  @IsString()
  @IsUppercase()
  @ApiProperty()
  realm: string;

  @ArrayNotEmpty()
  @ApiProperty({ isArray: true, type: () => ConfigManagerUpsertReq })
  configs: ConfigManagerUpsertReq[];
}
