import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { OpenApiGetRealmProperty } from '@/dtos/open-api-get-realm.property.dto';
import { OpenApiMetaProperty } from '@/dtos/open-api-meta.property.dto';

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
      description: `
        This endpoint allows you to upsert (update or insert) content into a specific realm. A realm is a collection
        of data with a unique identifier. You can provide the realm name as a parameter and the content to upsert in 
        the request body. Before performing the upsert, the endpoint validates the content against a predefined 
        schema if it exists, ensuring data consistency. If no schema exists for the specified content, the validation
        is skipped. The upsert operation updates the cache with the new content only for the data that already exists
        in the cache. If certain content is not present in the cache, it is unaffected by this operation. Additionally,
        if services like MQTT, BullMQ, and Redis PubSub are enabled, the endpoint emits the new content to these services.
        This allows other parts of your application to be notified of the changes and react accordingly. In summary, 
        this endpoint helps maintain data consistency within a realm, selectively updates the cache with the new content,
        and provides real-time notifications to enabled services when changes occur.`,
    }),
    ApiCreatedResponse({ description: 'request was successful' }),
    ApiBodyRealmUpsert(),
    ApiUnprocessableEntityResponse({ description: 'schema validation failed' }),
    ApiInternalServerErrorResponse({ description: 'something has seriously gone wrong..' }),
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
      description: `
        This endpoint retrieves information about a specific realm. A realm is a collection of data with a unique identifier. 
        You can specify the realm you want to access by providing its name as a parameter. Optionally, you can also provide a 
        list of specific content IDs within the realm to retrieve. If you don't provide any content IDs, this endpoint will 
        attempt to retrieve and return the entire content of the specified realm. It first checks if the requested data is 
        available in a cache, and if not, it fetches the data, caches it for future use, and returns it. If you do provide a 
        list of content IDs, the endpoint will attempt to fetch only the data corresponding to those IDs. It checks the cache 
        for any matching content and returns it. If some content IDs are not found in the cache, it fetches the missing data, 
        updates the cache, and returns the combined result. In summary, this endpoint provides efficient access to realm data, 
        minimizing unnecessary data retrieval and optimizing performance through caching.`,
    }),
    ApiOkResponse({ type: OpenApiGetRealmProperty, description: 'request was successful' }),
    ApiNotFoundResponse({ description: 'requested realm or id not found' }),
    ApiQueryConfigIds(),
    ApiQueryRealm(),
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
    ApiOkResponse({ type: OpenApiMetaProperty }),
    ApiQueryTake(),
    ApiQuerySkip(),
    ApiQueryVerbose(),
    ApiQuerySearch(),
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
