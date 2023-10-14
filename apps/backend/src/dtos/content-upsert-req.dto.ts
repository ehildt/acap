import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class ContentUpsertReq {
  @IsString()
  @ApiProperty()
  id: string;

  @IsDefined()
  @ApiProperty({
    isArray: true,
    oneOf: [
      { type: 'string' },
      { type: 'number' },
      { type: 'boolean' },
      { type: 'array', items: { type: 'object', additionalProperties: true } },
      { type: 'object', additionalProperties: true },
    ],
  })
  value: string | number | boolean | Record<string, unknown> | Array<unknown>;
}
