import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsUppercase } from 'class-validator';

export class RealmUpsertReq {
  @IsString()
  @IsUppercase()
  @ApiProperty()
  configId: string;

  @IsDefined()
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
  value: string | number | boolean | Record<string, unknown> | Array<unknown>;
}
