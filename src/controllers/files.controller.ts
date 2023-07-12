import { Controller, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as yaml from 'js-yaml';

import {
  DownloadFile,
  DownloadSchemaFile,
  JsonYamlContentParser,
  PostFile,
  PostSchemaFile,
} from '@/decorators/controller.method.decorators';
import { QueryFormat, QueryRealms } from '@/decorators/controller.parameter.decorators';
import { OpenApi_DownloadFile, OpenApi_PostFile } from '@/decorators/open-api.controller.decorators';
import { RealmService } from '@/services/realm.service';
import { SchemaService } from '@/services/schema.service';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly realmsService: RealmService,
    private readonly schemaService: SchemaService,
  ) {}

  @PostFile()
  @OpenApi_PostFile()
  async uploadRealmFile(@JsonYamlContentParser() content: any) {
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
  async uploadSchemaFile(@JsonYamlContentParser() content: any) {
    return await this.schemaService.upsertRealms(content);
  }

  @DownloadSchemaFile()
  @OpenApi_DownloadFile()
  async downloadSchemaFile(@QueryRealms() realms?: string[]) {
    const file = await this.schemaService.downloadConfigFile(realms);
    return new StreamableFile(Buffer.from(JSON.stringify(file, null, 4)));
  }
}
