import { ApiProperty } from '@nestjs/swagger';
import { CONFIG_SOURCE } from '../constants/config-source.enum';
import { ValueProperty } from '../decorators/class-validator-properties.decorator';

export class ConfigManagerUpsertRes {
  constructor(copy?: ConfigManagerUpsertRes) {
    Object.assign(this, copy);
  }

  @ApiProperty()
  configId: string;

  @ValueProperty()
  value: string | Record<string, unknown>;

  @ApiProperty({ enum: CONFIG_SOURCE })
  source: CONFIG_SOURCE;
}
