import { ApiBody, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

import { RealmRes } from '../dtos/realm-res.dto';
import { RealmUpsertReq } from '../dtos/realm-upsert-req.dto';
import { RealmsUpsertReq } from '../dtos/realms-upsert.dto.req';

export const ApiParamRealm = () => ApiParam({ name: 'realm', type: String });
export const ApiQueryConfigIds = () => ApiQuery({ name: 'configIds', type: String, isArray: true });
export const ApiQueryTake = () => ApiQuery({ name: 'take', example: '100' });
export const ApiQuerySkip = () => ApiQuery({ name: 'skip', example: '0' });
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

export const ApiBodyPubSub = () =>
  ApiBody({
    type: 'object',
    required: true,
    schema: {
      oneOf: [
        { type: 'string', description: 'string or text' },
        { type: 'number', description: 'a number' },
        { type: 'boolean', description: 'a boolean' },
        { type: 'Object', description: 'plain old javascript object' },
        { type: 'Array', description: 'a list of dreams & cookies' },
      ],
    },
  });

export const ApiOkResponseRealmUpsert = () =>
  ApiOkResponse({
    isArray: true,
    type: RealmUpsertReq,
  });

export const ApiOkResponsePagination = () =>
  ApiOkResponse({
    isArray: true,
    type: RealmRes,
  });
