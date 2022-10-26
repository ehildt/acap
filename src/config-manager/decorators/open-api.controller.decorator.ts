import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  ApiBodyConfigManagerUpsert,
  ApiOkResponseConfigManagerUpsert,
  ApiOkResponseGetByPagination,
  ApiParamConfigId,
  ApiParamNamespace,
  ApiQuerySkip,
  ApiQueryTake,
} from './open-api.method.decorator';

export function OpenApi_Upsert() {
  return applyDecorators(
    ApiCreatedResponse(),
    ApiBadRequestResponse(),
    ApiBodyConfigManagerUpsert(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_GetAllPagination() {
  return applyDecorators(
    ApiOkResponseGetByPagination(),
    ApiQueryTake(),
    ApiQuerySkip(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_GetByNamespace() {
  return applyDecorators(
    ApiParamNamespace(),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
    ApiOkResponseConfigManagerUpsert(),
  );
}

export function OpenApi_GetByNamespaceConfigIds() {
  return applyDecorators(
    ApiOkResponse(),
    ApiParamConfigId(),
    ApiParamNamespace(),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
  );
}

export function OpenApi_DeleteByNamespace() {
  return applyDecorators(ApiParamNamespace(), ApiNoContentResponse(), ApiInternalServerErrorResponse());
}

export function OpenApi_DeleteByNamespaceConfigIds() {
  return applyDecorators(
    ApiParamConfigId(),
    ApiParamNamespace(),
    ApiNoContentResponse(),
    ApiInternalServerErrorResponse(),
  );
}
