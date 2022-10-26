import { ApiProperty } from '@nestjs/swagger';
import { ValueProperty } from '../decorators/class.property.decorator';

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

  @ValueProperty()
  value: string | Record<string, unknown>;
}
