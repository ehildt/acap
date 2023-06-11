import { MultipartFile } from '@fastify/multipart';
import { Controller, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JsonFile } from '@/decorators/class.property.values';
import { DownloadFile, DownloadSchemaFile, PostFile, PostSchemaFile } from '@/decorators/controller.method.decorators';
import { QueryRealms } from '@/decorators/controller.parameter.decorators';
import { OpenApi_DownloadFile, OpenApi_PostFile } from '@/decorators/open-api.controller.decorators';
import { RealmsService } from '@/services/realms.service';
import { SchemaService } from '@/services/schema.service';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly realmsService: RealmsService, private readonly schemaService: SchemaService) {}

  @PostFile()
  @OpenApi_PostFile()
  async uploadRealmFile(@JsonFile() file: MultipartFile) {
    const content = JSON.parse((await file.toBuffer()).toString());
    return await this.realmsService.upsertRealms(content);
  }

  @DownloadFile()
  @OpenApi_DownloadFile()
  async downloadRealmFile(@QueryRealms() realms?: string[]) {
    const file = await this.realmsService.downloadConfigFile(realms);
    return new StreamableFile(Buffer.from(JSON.stringify(file, null, 4)));
  }

  @PostSchemaFile()
  @OpenApi_PostFile()
  async uploadSchemaFile(@JsonFile() file: MultipartFile) {
    const content = JSON.parse((await file.toBuffer()).toString());
    return await this.schemaService.upsertRealms(content);
  }

  @DownloadSchemaFile()
  @OpenApi_DownloadFile()
  async downloadSchemaFile(@QueryRealms() realms?: string[]) {
    const file = await this.schemaService.downloadConfigFile(realms);
    return new StreamableFile(Buffer.from(JSON.stringify(file, null, 4)));
  }
}
