import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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
  ApiQueryTtlServiceId,
} from './open-api.method.decorator';

export function OpenApi_Upsert() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiQueryTtlServiceId(),
    ApiCreatedResponse(),
    ApiBadRequestResponse(),
    ApiBodyConfigManagerUpsert(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_GetByServiceId() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParamServiceId(),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
    ApiOkResponseConfigManagerUpsert(),
  );
}

export function OpenApi_GetByServiceIdConfigIds() {
  return applyDecorators(
    ApiOkResponse(),
    ApiBearerAuth(),
    ApiParamConfigId(),
    ApiParamServiceId(),
    ApiInternalServerErrorResponse(),
    ApiUnprocessableEntityResponse(),
  );
}

export function OpenApi_DeleteByServiceId() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParamServiceId(),
    ApiNoContentResponse(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_DeleteByServiceIdConfigIds() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiParamConfigId(),
    ApiParamServiceId(),
    ApiNoContentResponse(),
    ApiInternalServerErrorResponse(),
  );
}
