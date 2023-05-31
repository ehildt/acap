import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { RealmsRes } from '../dtos/realms-res.dto.res';
import { RealmsUpsertReq } from '../dtos/realms-upsert.dto.req';
import {
  ApiBodyRealmUpsert,
  ApiBodyRealmUpsertPerRealm,
  ApiParamRealm,
  ApiQueryConfigIds,
  ApiQueryRealm,
  ApiQueryRealms,
  ApiQuerySkip,
  ApiQueryTake,
} from './open-api.method.decorators';

export function OpenApi_PostFile() {
  return applyDecorators(
    ApiCreatedResponse(),
    ApiBadRequestResponse(),
    ApiInternalServerErrorResponse(),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['config.json'],
        properties: {
          'config.json': {
            description: 'a json file, which contains the configuration(s) for the realm(s)',
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}

export function OpenApi_DownloadFile() {
  return applyDecorators(
    ApiProduces('application/json'),
    ApiBadRequestResponse(),
    ApiInternalServerErrorResponse(),
    ApiQueryRealms(),
    ApiUnprocessableEntityResponse(),
    ApiOkResponse({
      type: RealmsUpsertReq,
      isArray: true,
      schema: {
        type: 'string',
        format: 'binary',
      },
    }),
  );
}

export function OpenApi_Upsert() {
  return applyDecorators(
    ApiCreatedResponse(),
    ApiBadRequestResponse(),
    ApiBodyRealmUpsert(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_UpsertRealms() {
  return applyDecorators(
    ApiCreatedResponse(),
    ApiBadRequestResponse(),
    ApiBodyRealmUpsertPerRealm(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_PubSub() {
  return applyDecorators(
    ApiOperation({
      description: 'Immediately publishes the payload. The cache and database are bypassed',
    }),
    ApiOkResponse(),
    ApiBadRequestResponse(),
    ApiBodyRealmUpsertPerRealm(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_GetRealm() {
  return applyDecorators(
    ApiOperation({
      description:
        'Returns the realm from cache. Otherwise fetches it from the database, populates the cache and returns the entity',
    }),
    ApiOkResponse(),
    ApiQueryConfigIds(),
    ApiQueryRealm(),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
  );
}

export function OpenApi_GetRealms() {
  return applyDecorators(
    ApiOperation({
      description:
        'If a value for realms is provided, then take and skip are ignored. Otherwise all realms are paginated.',
    }),
    ApiOkResponse({ type: RealmsRes }),
    ApiQueryRealms(false),
    ApiQueryTake(),
    ApiQuerySkip(),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
  );
}

export function OpenApi_DeleteRealm() {
  return applyDecorators(
    ApiOperation({
      description: `If a value for realm is provided, then the whole realm is deleted from cache AND database. 
        Otherwise if also configIds are provided, then only the configIds are deleted from cache AND the database. 
        If a realm has no more configIds, then the realm is also deleted.`,
    }),
    ApiQueryConfigIds(),
    ApiParamRealm(),
    ApiNoContentResponse(),
    ApiInternalServerErrorResponse(),
  );
}
