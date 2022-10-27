import { IsDefined, IsString, IsUppercase } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { oneOf } from '../decorators/class.property.values';

export class ConfigManagerUpsertReq {
  @IsString()
  @IsUppercase()
  @ApiProperty()
  configId: string;

  @IsDefined()
  @ApiProperty(oneOf)
  value: string | Record<string, unknown> | Array<unknown>;
}
