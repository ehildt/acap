import { ApiProperty } from '@nestjs/swagger';

class MetaItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  hasSchema: boolean;

  @ApiProperty({
    required: false,
    oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }, { type: 'object' }, { type: 'array' }],
  })
  value?: string | number | boolean | Record<string, unknown> | Array<unknown>;
}

class MetaObject {
  @ApiProperty({ type: MetaItem, isArray: true, required: false })
  EXAMPLE_REALM?: Array<MetaItem>;
}

export class MetaRes {
  @ApiProperty({
    description: 'as in the amount of total realms/schemas in the database',
  })
  count: number;

  @ApiProperty({
    type: MetaObject,
    description: 'a simple POJO',
  })
  data: Record<string, unknown>;
}
