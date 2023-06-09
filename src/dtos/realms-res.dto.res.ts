import { ApiProperty } from '@nestjs/swagger';

import { RealmUpsertReq } from './realm-upsert-req.dto';

class RealmKeyValuePair {
  @ApiProperty({
    isArray: true,
    type: () => RealmUpsertReq,
    oneOf: [
      { type: 'string', description: 'string or text' },
      { type: 'number', description: 'a number' },
      { type: 'boolean', description: 'a boolean' },
      { type: 'object', description: 'plain old javascript object' },
      { type: 'array', description: 'a list of dreams & cookies' },
    ],
  })
  id: string | Record<string, unknown> | Array<unknown>;
}

export class RealmsRes {
  @ApiProperty({
    type: RealmKeyValuePair,
  })
  realm: Record<string, unknown>;
}
