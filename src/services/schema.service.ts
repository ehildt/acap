import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { ContentUpsertReq } from '@/dtos/content-upsert-req.dto';
import { RealmsUpsertReq } from '@/dtos/realms-upsert.dto.req';
import { reduceEntities } from '@/helpers/reduce-entities.helper';
import { SchemaRepository } from '@/repositories/schema.repository';

import { ConfigFactoryService } from './config-factory.service';

@Injectable()
export class SchemaService {
  constructor(
    private readonly schemaRepository: SchemaRepository,
    private readonly factory: ConfigFactoryService,
  ) {}

  async upsertRealm(realm: string, req: Array<ContentUpsertReq>) {
    const result = await this.schemaRepository.upsert(realm, req);
    if (!result?.ok) throw new InternalServerErrorException(result);
    return result;
  }

  async upsertRealms(reqs: RealmsUpsertReq[]) {
    const result = await this.schemaRepository.upsertMany(reqs);
    if (!result?.ok) throw new InternalServerErrorException(result);
    return result;
  }

  async getRealmContentByIds(realm: string, ids: Array<string>, allowThrow = true) {
    const entities = await this.schemaRepository.where({
      realm,
      id: { $in: ids },
    });

    if (entities?.length < ids?.length && allowThrow)
      throw new NotFoundException(
        `No such ID::${ids.filter((id) => !entities.find(({ _id }) => _id === id))} in REALM::${realm}`,
      );

    return reduceEntities(this.factory.app.realm.resolveEnv, entities);
  }

  async deleteRealm(realm: string) {
    const entity = await this.schemaRepository.delete(realm);
    if (!entity.deletedCount) throw new NotFoundException(entity);
    return entity;
  }

  async deleteRealmContentByIds(realm: string, ids: Array<string>) {
    const entity = await this.schemaRepository.delete(realm, ids);
    if (!entity.deletedCount) throw new NotFoundException(entity);
    return entity;
  }

  async getRealm(realm: string) {
    return await this.schemaRepository.where({ realm });
  }

  async countRealmContents() {
    return await this.schemaRepository.countContents();
  }

  async countSchemas() {
    return await this.schemaRepository.countSchemas();
  }
}
