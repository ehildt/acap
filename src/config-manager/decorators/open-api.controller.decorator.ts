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
  ApiParamConfigId,
  ApiParamServiceId,
} from './open-api.method.decorator';

export function OpenApi_Upsert() {
  return applyDecorators(
    ApiCreatedResponse(),
    ApiBadRequestResponse(),
    ApiBodyConfigManagerUpsert(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_GetByServiceId() {
  return applyDecorators(
    ApiParamServiceId(),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
    ApiOkResponseConfigManagerUpsert(),
  );
}

export function OpenApi_GetByServiceIdConfigIds() {
  return applyDecorators(
    ApiOkResponse(),
    ApiParamConfigId(),
    ApiParamServiceId(),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
  );
}

export function OpenApi_DeleteByServiceId() {
  return applyDecorators(ApiParamServiceId(), ApiNoContentResponse(), ApiInternalServerErrorResponse());
}

export function OpenApi_DeleteByServiceIdConfigIds() {
  return applyDecorators(
    ApiParamConfigId(),
    ApiParamServiceId(),
    ApiNoContentResponse(),
    ApiInternalServerErrorResponse(),
  );
}
