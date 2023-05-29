import { ApiProperty } from '@nestjs/swagger';

export class ConfigManagerGetReq {
  @ApiProperty()
  realm: string;

  @ApiProperty()
  configId: string;
}
