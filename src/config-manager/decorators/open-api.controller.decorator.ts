import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  ApiBodyConfigManagerUpsert,
  ApiOkResponseConfigManagerUpsert,
  ApiParamConfigId,
  ApiParamServiceId,
  ApiQueryTTLServiceId,
} from './open-api.method.decorator';

export function OpenApi_Upsert() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiCreatedResponse(),
    ApiQueryTTLServiceId(),
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
    ApiOkResponse(),
    ApiBearerAuth(),
    ApiParamServiceId(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_DeleteByServiceIdConfigIds() {
  return applyDecorators(
    ApiOkResponse(),
    ApiBearerAuth(),
    ApiParamConfigId(),
    ApiParamServiceId(),
    ApiInternalServerErrorResponse(),
  );
}
