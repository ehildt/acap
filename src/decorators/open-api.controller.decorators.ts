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

import { RealmsRes } from '../dtos/realms-res.dto.res';
import { RealmsUpsertReq } from '../dtos/realms-upsert.dto.req';
import {
  ApiBodyRealmUpsert,
  ApiBodyRealmUpsertPerRealm,
  ApiOkResponsePagination,
  ApiOkResponseRealmUpsert,
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

export function OpenApi_PassThrough() {
  return applyDecorators(
    ApiOkResponse(),
    ApiBadRequestResponse(),
    ApiBodyRealmUpsertPerRealm(),
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
    ApiOkResponseRealmUpsert(),
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
    ApiOkResponse({ type: RealmsRes }),
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
