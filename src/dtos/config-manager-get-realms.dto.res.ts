import { ApiProperty } from '@nestjs/swagger';

import { ConfigManagerUpsertReq } from './config-manager-upsert-req.dto';

class ConfigManagerKeyValuePair {
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
  configId: string | Record<string, unknown> | Array<unknown>;
}

export class ConfigManagerGetRealmsRes {
  @ApiProperty({
    type: ConfigManagerKeyValuePair,
  })
  realm: Record<string, unknown>;
}
