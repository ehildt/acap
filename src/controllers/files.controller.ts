import { Controller, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
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
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { ConfigFactoryService } from '@/services/config-factory.service';
import { CryptoService } from '@/services/crypto.service';
import { RealmService } from '@/services/realm.service';
import { SchemaService } from '@/services/schema.service';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly realmsService: RealmService,
    private readonly schemaService: SchemaService,
    private readonly cryptoService: CryptoService,
    private readonly configFactory: ConfigFactoryService,
  ) {}

  @PostFile()
  @OpenApi_PostFile()
  async uploadRealmFile(@JsonYamlContentParser() content: Array<RealmsUpsertReq>) {
    if (!this.configFactory.app.crypto.symmetricKey || !this.configFactory.app.crypto.symmetricAlgorithm)
      return await this.realmsService.upsertRealms(content);
    const realmsEncrypted = this.cryptoService.encryptRealmsUpsertReq(content);
    return await this.realmsService.upsertRealms(realmsEncrypted);
  }

  @DownloadFile()
  @OpenApi_DownloadFile()
  async downloadRealmFile(@Res() reply: FastifyReply, @QueryFormat() format: string, @QueryRealms() realms?: string[]) {
    const file = await this.realmsService.downloadConfigFile(realms);
    void reply.header('Content-Type', 'application/octet-stream');
    void reply.header('Content-Disposition', `attachment; filename="realms.${format}"`);
    if (format === 'json') void reply.send(Buffer.from(JSON.stringify(file, null, 4)));
    else void reply.send(Buffer.from(yaml.dump(file)));
  }

  @PostSchemaFile()
  @OpenApi_PostFile()
  async uploadSchemaFile(@JsonYamlContentParser() content: any) {
    return await this.schemaService.upsertRealms(content);
  }

  @DownloadSchemaFile()
  @OpenApi_DownloadFile()
  async downloadSchemaFile(@Res() reply: FastifyReply, @QueryRealms() realms?: string[]) {
    const file = await this.schemaService.downloadConfigFile(realms);
    void reply.header('Content-Type', 'application/octet-stream');
    void reply.header('Content-Disposition', 'attachment; filename="schemas.json"');
    void reply.send(Buffer.from(JSON.stringify(file, null, 4)));
  }
}
