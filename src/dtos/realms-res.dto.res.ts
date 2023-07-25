import { ApiProperty } from '@nestjs/swagger';

import { ContentUpsertReq } from './content-upsert-req.dto';

class RealmKeyValuePair {
  @ApiProperty({
    isArray: true,
    type: () => ContentUpsertReq,
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
