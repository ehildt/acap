import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsUppercase } from 'class-validator';

export class ConfigManagerUpsertReq {
  @IsString()
  @IsUppercase()
  @ApiProperty()
  configId: string;

  @IsDefined()
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
