import { ApiProperty } from '@nestjs/swagger';
import { oneOf } from '../decorators/class.property.values';

export class ConfigManagerRes {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  namespace: string;

  @ApiProperty()
  configId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty(oneOf)
  value: string | Record<string, unknown> | Array<unknown>;
}
