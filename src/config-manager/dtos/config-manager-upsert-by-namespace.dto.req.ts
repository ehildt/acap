import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsString, IsUppercase } from 'class-validator';

import { ConfigManagerUpsertReq } from './config-manager-upsert-req.dto';

export class ConfigManagerUpsertNamespaceReq {
  @IsString()
  @IsUppercase()
  @ApiProperty()
  namespace: string;

  @ArrayNotEmpty()
  @ApiProperty({ isArray: true, type: () => ConfigManagerUpsertReq })
  configs: ConfigManagerUpsertReq[];
}
