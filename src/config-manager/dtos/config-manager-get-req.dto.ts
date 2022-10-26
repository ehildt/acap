import { ApiProperty } from '@nestjs/swagger';

export class ConfigManagerGetReq {
  @ApiProperty()
  namespace: string;

  @ApiProperty()
  configId: string;
}
