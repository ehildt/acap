import { ApiProperty } from '@nestjs/swagger';

import { RealmUpsertReq } from './realm-upsert-req.dto';

export class RealmRes {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  realm: string;

  @ApiProperty()
  configId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    isArray: true,
    type: () => RealmUpsertReq,
    oneOf: [
      { type: 'string', description: 'string or text' },
      { type: 'number', description: 'a number' },
      { type: 'boolean', description: 'a boolean' },
      { type: 'Object', description: 'plain old javascript object' },
      { type: 'Array', description: 'a list of dreams & cookies' },
    ],
  })
  value: string | Record<string, unknown> | Array<unknown>;
}
