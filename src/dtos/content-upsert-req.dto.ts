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
      { type: 'string', description: 'string or text' },
      { type: 'number', description: 'a number' },
      { type: 'boolean', description: 'a boolean' },
      { type: 'object', description: 'plain old javascript object' },
      { type: 'array', description: 'a list of dreams & cookies' },
    ],
  })
  value: string | number | boolean | Record<string, unknown> | Array<unknown>;
}
