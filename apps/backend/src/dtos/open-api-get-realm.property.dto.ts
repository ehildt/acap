import { ApiProperty } from '@nestjs/swagger';

export class OpenApiGetRealmProperty {
  @ApiProperty({
    type: 'object',
    oneOf: [
      { type: 'string' },
      { type: 'number' },
      { type: 'boolean' },
      { type: 'array', items: { type: 'object', additionalProperties: true } },
      { type: 'object', additionalProperties: true },
    ],
  })
  EXAMPLE_ID?: string | number | boolean | Record<string, unknown> | Array<unknown>;
}
