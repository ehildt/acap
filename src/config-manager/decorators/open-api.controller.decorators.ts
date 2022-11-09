import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  ApiBodyConfigManagerUpsert,
  ApiBodyConfigManagerUpsertPerNamespace,
  ApiOkResponseConfigManagerUpsert,
  ApiOkResponsePagination,
  ApiParamNamespace,
  ApiQueryConfigIds,
  ApiQueryNamespaces,
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
            description: 'a json file, which contains the configuration(s) for the namespace(s)',
            type: 'string',
            format: 'binary',
          },
        },
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

export function OpenApi_UpsertNamespaces() {
  return applyDecorators(
    ApiCreatedResponse(),
    ApiBadRequestResponse(),
    ApiBodyConfigManagerUpsertPerNamespace(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_GetPagination() {
  return applyDecorators(ApiOkResponsePagination(), ApiQueryTake(), ApiQuerySkip(), ApiInternalServerErrorResponse());
}

export function OpenApi_GetNamespace() {
  return applyDecorators(
    ApiParamNamespace(),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
    ApiOkResponseConfigManagerUpsert(),
  );
}

export function OpenApi_GetNamespaceConfigIds() {
  return applyDecorators(
    ApiOkResponse(),
    ApiQueryConfigIds(),
    ApiParamNamespace(),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
  );
}

export function OpenApi_GetNamespaces() {
  return applyDecorators(
    ApiOkResponse(),
    ApiQueryNamespaces(),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
  );
}

export function OpenApi_DeleteNamespace() {
  return applyDecorators(ApiParamNamespace(), ApiNoContentResponse(), ApiInternalServerErrorResponse());
}

export function OpenApi_DeleteNamespaceConfigIds() {
  return applyDecorators(
    ApiQueryConfigIds(),
    ApiParamNamespace(),
    ApiNoContentResponse(),
    ApiInternalServerErrorResponse(),
  );
}