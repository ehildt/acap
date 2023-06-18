import { Controller, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as yaml from 'js-yaml';

import { JsonYamlContent } from '@/decorators/class.property.values';
import { DownloadFile, DownloadSchemaFile, PostFile, PostSchemaFile } from '@/decorators/controller.method.decorators';
import { QueryFormat, QueryRealms } from '@/decorators/controller.parameter.decorators';
import { OpenApi_DownloadFile, OpenApi_PostFile } from '@/decorators/open-api.controller.decorators';
import { RealmsService } from '@/services/realms.service';
import { SchemaService } from '@/services/schema.service';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly realmsService: RealmsService, private readonly schemaService: SchemaService) {}

  @PostFile()
  @OpenApi_PostFile()
  async uploadRealmFile(@JsonYamlContent() content: any) {
    return await this.realmsService.upsertRealms(content);
  }

  @DownloadFile()
  @OpenApi_DownloadFile()
  async downloadRealmFile(@QueryFormat() format: string, @QueryRealms() realms?: string[]) {
    const file = await this.realmsService.downloadConfigFile(realms);
    if (format === 'json') return new StreamableFile(Buffer.from(JSON.stringify(file, null, 4)));
    return new StreamableFile(Buffer.from(yaml.dump(file)));
  }

  @PostSchemaFile()
  @OpenApi_PostFile()
  async uploadSchemaFile(@JsonYamlContent() content: any) {
    return await this.schemaService.upsertRealms(content);
  }

  @DownloadSchemaFile()
  @OpenApi_DownloadFile()
  async downloadSchemaFile(@QueryRealms() realms?: string[]) {
    const file = await this.schemaService.downloadConfigFile(realms);
    return new StreamableFile(Buffer.from(JSON.stringify(file, null, 4)));
  }
}
