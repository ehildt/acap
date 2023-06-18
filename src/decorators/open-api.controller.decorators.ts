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
  ApiParamConfigId,
  ApiParamRealm,
  ApiQueryConfigIds,
  ApiQueryRealm,
  ApiQueryRealms,
  ApiQuerySkip,
  ApiQueryTake,
} from './open-api.method.decorators';

const APPLICATION_YAML = 'application/x-yaml';
const APPLICATION_JSON = 'application/json';

export function OpenApi_PostFile() {
  return applyDecorators(
    ApiOperation({
      description: 'Uploads a json file containing the realms',
    }),
    ApiCreatedResponse(),
    ApiBadRequestResponse(),
    ApiInternalServerErrorResponse(),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['realm-config.json'],
        properties: {
          'realm-config.json': {
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
    ApiOperation({
      description: 'Downloads the realms as a json file',
    }),
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
    ApiOperation({
      description:
        'Upserts a realm in the database. The realm is not cached, but changes are emitted if REDIS_PUBLISHER_PUBLISH_EVENTS is set to true',
    }),
    ApiConsumes(APPLICATION_JSON, APPLICATION_YAML),
    ApiCreatedResponse(),
    ApiBadRequestResponse(),
    ApiBodyRealmUpsert(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_SchemaUpsert() {
  return applyDecorators(
    ApiOperation({
      description: 'Upserts a schema in the database. The schema is not cached',
    }),
    ApiConsumes(APPLICATION_JSON, APPLICATION_YAML),
    ApiCreatedResponse(),
    ApiBadRequestResponse(),
    ApiBodyRealmUpsert(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_UpsertRealms() {
  return applyDecorators(
    ApiOperation({
      description:
        'Upserts realms in the database. The realms are not cached, but changes are emitted if REDIS_PUBLISHER_PUBLISH_EVENTS is set to true',
    }),
    ApiConsumes(APPLICATION_JSON, APPLICATION_YAML),
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
    ApiConsumes(APPLICATION_JSON, APPLICATION_YAML),
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

export function OpenApi_GetSchema() {
  return applyDecorators(
    ApiOperation({
      description:
        'Returns the json schema from cache. Otherwise fetches it from the database, populates the cache and returns the entity',
    }),
    ApiOkResponse(),
    ApiParamConfigId(),
    ApiParamRealm(),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
  );
}

export function OpenApi_GetRealmConfig() {
  return applyDecorators(
    ApiOperation({
      description:
        'Returns the realm config a from cache. Otherwise fetches it from the database, populates the cache and returns the entity',
    }),
    ApiOkResponse(),
    ApiParamConfigId(),
    ApiParamRealm(),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
  );
}

export function OpenApi_GetRealmCherryPick() {
  return applyDecorators(
    ApiOperation({
      description:
        'Returns the realm config a from cache. Otherwise fetches it from the database, populates the cache and returns the entity',
    }),
    ApiOkResponse(),
    ApiConsumes(APPLICATION_JSON, APPLICATION_YAML),
    ApiBody({ type: () => String, required: false }),
    ApiParamConfigId(),
    ApiParamRealm(),
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
        Otherwise if also ids are provided, then only the ids are deleted from cache AND the database. 
        If a realm has no more ids, then the realm is also deleted.`,
    }),
    ApiQueryConfigIds(),
    ApiParamRealm(),
    ApiNoContentResponse(),
    ApiInternalServerErrorResponse(),
  );
}
