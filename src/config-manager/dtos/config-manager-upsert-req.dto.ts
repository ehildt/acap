import { IsDefined, IsEnum, IsString, IsUppercase } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CONFIG_SOURCE } from '../constants/config-source.enum';
import { ValueProperty } from '../decorators/class-validator-properties.decorator';

export class ConfigManagerUpsertReq {
  constructor(copy?: ConfigManagerUpsertReq) {
    Object.assign(this, copy);
  }

  @IsString()
  @IsUppercase()
  @ApiProperty()
  configId: string;

  @IsDefined()
  @ValueProperty()
  value: string | Record<string, unknown>;

  @IsEnum(CONFIG_SOURCE)
  @IsUppercase()
  @ApiProperty({ enum: CONFIG_SOURCE })
  source: CONFIG_SOURCE;
}
