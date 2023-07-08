import { Injectable } from '@nestjs/common';

import { RealmRepository } from '@/repositories/realm.repository';

@Injectable()
export class MetaService {
  constructor(private readonly configRepo: RealmRepository) {}

  async getMeta(take: number, skip: number) {
    const collection = {};
    const entities = await this.configRepo.getMeta(take, skip, ['realm', 'id', 'createdAt', 'updatedAt', '-_id']);
    // fetch schemas
    entities.forEach(({ realm, ...rest }) => {
      const values = collection[realm];
      if (!Array.isArray(values)) collection[realm] = [rest /** hasSchema */];
      else values.push(rest /** hasSchema */);
    });
    return collection;
  }
}
