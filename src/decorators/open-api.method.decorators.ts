import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

import { RealmUpsertReq } from '../dtos/realm-upsert-req.dto';
import { RealmsUpsertReq } from '../dtos/realms-upsert.dto.req';

export const ApiQueryRealm = () => ApiQuery({ name: 'realm', type: String });
export const ApiParamRealm = () => ApiParam({ name: 'realm', type: String });
export const ApiQueryConfigIds = () => ApiQuery({ name: 'configIds', type: String, isArray: true, required: false });
export const ApiQueryTake = () => ApiQuery({ name: 'take', example: '100', required: false });
export const ApiQuerySkip = () => ApiQuery({ name: 'skip', example: '0', required: false });
export const ApiQueryRealms = (required = false) => ApiQuery({ name: 'realms', type: String, isArray: true, required });

export const ApiBodyRealmUpsert = () =>
  ApiBody({
    isArray: true,
    required: true,
    type: RealmUpsertReq,
  });

export const ApiBodyRealmUpsertPerRealm = () =>
  ApiBody({
    isArray: true,
    required: true,
    type: RealmsUpsertReq,
  });