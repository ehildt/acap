import { ApiProperty } from '@nestjs/swagger';

import { ConfigManagerUpsertReq } from './config-manager-upsert-req.dto';

export class ConfigManagerRes {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  namespace: string;

  @ApiProperty()
  configId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    isArray: true,
    type: () => ConfigManagerUpsertReq,
    oneOf: [
      { type: 'string', description: 'string or text' },
      { type: 'string', description: 'environment variable identifier' },
      { type: 'Object', description: 'plain old javascript object' },
      { type: 'Array', description: 'a list of dreams & cookies' },
    ],
  })
  value: string | Record<string, unknown> | Array<unknown>;
}
