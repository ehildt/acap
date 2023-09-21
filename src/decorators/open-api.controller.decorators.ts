import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import {
  ApiBodyRealmUpsert,
  ApiBodyRealmUpsertPerRealm,
  ApiParamConfigId,
  ApiParamMeta,
  ApiParamRealm,
  ApiQueryConfigIds,
  ApiQueryRealm,
  ApiQuerySearch,
  ApiQuerySkip,
  ApiQueryTake,
  ApiQueryVerbose,
} from './open-api.method.decorators';

const APPLICATION_YAML = 'application/x-yaml';
const APPLICATION_JSON = 'application/json';

export function OpenApi_Upsert() {
  return applyDecorators(
    ApiOperation({
      description:
        'Upserts a realm in the database. The realm is not cached, but changes are emitted if REDIS_PUBSUB_PUBLISH_EVENTS is set to true',
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
        'Upserts realms in the database. The realms are not cached, but changes are emitted if REDIS_PUBSUB_PUBLISH_EVENTS is set to true',
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

export function OpenApi_GetMeta() {
  return applyDecorators(
    ApiOperation({
      description: 'Returns the meta data',
    }),
    ApiParamMeta(),
    ApiOkResponse(),
    ApiQueryTake(),
    ApiQuerySkip(),
    ApiQueryVerbose(),
    ApiQuerySearch(),
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
    ApiOkResponse(),
    ApiInternalServerErrorResponse(),
  );
}
