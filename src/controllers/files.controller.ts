import { MultipartFile } from '@fastify/multipart';
import { Controller, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JsonFile } from '@/decorators/class.property.values';
import { DownloadFile, PostFile } from '@/decorators/controller.method.decorators';
import { QueryRealms } from '@/decorators/controller.parameter.decorators';
import { OpenApi_DownloadFile, OpenApi_PostFile } from '@/decorators/open-api.controller.decorators';
import { RealmsService } from '@/services/realms.service';

@ApiTags('Files')
@Controller('realms')
export class FilesController {
  constructor(private readonly realmsService: RealmsService) {}

  @PostFile()
  @OpenApi_PostFile()
  async uploadFile(@JsonFile() file: MultipartFile) {
    const content = JSON.parse((await file.toBuffer()).toString());
    return await this.realmsService.upsertRealms(content);
  }

  @DownloadFile()
  @OpenApi_DownloadFile()
  async downloadConfigFile(@QueryRealms() realms?: string[]) {
    const file = await this.realmsService.downloadConfigFile(realms);
    return new StreamableFile(Buffer.from(JSON.stringify(file, null, 4)));
  }
}
