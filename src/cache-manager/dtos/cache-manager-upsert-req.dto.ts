import { IsDefined, IsString, IsUppercase } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValueProperty } from '../decorators/class.property.decorator';

export class CacheManagerUpsertReq {
  constructor(copy?: CacheManagerUpsertReq) {
    Object.assign(this, copy);
  }

  @IsString()
  @IsUppercase()
  @ApiProperty()
  configId: string;

  @IsDefined()
  @ValueProperty()
  value?: string | Record<string, unknown>;
}
