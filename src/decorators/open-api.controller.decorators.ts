import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiProduces,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { ConfigManagerGetRealmsRes } from '../dtos/config-manager-get-realms.dto.res';
import { ConfigManagerUpsertRealmReq } from '../dtos/config-manager-upsert-by-realm.dto.req';
import {
  ApiBodyConfigManagerUpsert,
  ApiBodyConfigManagerUpsertPerRealm,
  ApiOkResponseConfigManagerUpsert,
  ApiOkResponsePagination,
  ApiParamRealm,
  ApiQueryConfigIds,
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
      type: ConfigManagerUpsertRealmReq,
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
    ApiBodyConfigManagerUpsert(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_UpsertRealms() {
  return applyDecorators(
    ApiCreatedResponse(),
    ApiBadRequestResponse(),
    ApiBodyConfigManagerUpsertPerRealm(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_PassThrough() {
  return applyDecorators(
    ApiOkResponse(),
    ApiBadRequestResponse(),
    ApiBodyConfigManagerUpsertPerRealm(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_GetPagination() {
  return applyDecorators(ApiOkResponsePagination(), ApiQueryTake(), ApiQuerySkip(), ApiInternalServerErrorResponse());
}

export function OpenApi_GetRealm() {
  return applyDecorators(
    ApiParamRealm(),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
    ApiOkResponseConfigManagerUpsert(),
  );
}

export function OpenApi_GetRealmConfigIds() {
  return applyDecorators(
    ApiOkResponse(),
    ApiQueryConfigIds(),
    ApiParamRealm(),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
  );
}

export function OpenApi_GetRealms() {
  return applyDecorators(
    ApiOkResponse({ type: ConfigManagerGetRealmsRes }),
    ApiQueryRealms(true),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
  );
}

export function OpenApi_DeleteRealm() {
  return applyDecorators(ApiParamRealm(), ApiNoContentResponse(), ApiInternalServerErrorResponse());
}

export function OpenApi_DeleteRealmConfigIds() {
  return applyDecorators(
    ApiQueryConfigIds(),
    ApiParamRealm(),
    ApiNoContentResponse(),
    ApiInternalServerErrorResponse(),
  );
}
