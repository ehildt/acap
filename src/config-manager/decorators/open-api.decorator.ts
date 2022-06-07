import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';

const ServiceIdParam = () => ApiParam({ name: 'serviceId', type: String });
const ConfigIdParam = () => ApiParam({ name: 'configIds', type: String });

export function OpenApi_Upsert() {
  return applyDecorators(
    ApiBody({
      required: true,
      type: ConfigManagerUpsertReq,
      isArray: true,
    }),
    ApiCreatedResponse(),
    ApiInternalServerErrorResponse(),
    ApiBadRequestResponse(),
  );
}

export function OpenApi_GetByServiceId() {
  return applyDecorators(
    ApiInternalServerErrorResponse(),
    ApiNoContentResponse(),
    ApiOkResponse(),
    ServiceIdParam(),
  );
}

export function OpenApi_GetByServiceIdConfigIds() {
  return applyDecorators(
    ApiInternalServerErrorResponse(),
    ApiNoContentResponse(),
    ApiOkResponse(),
    ServiceIdParam(),
    ConfigIdParam(),
  );
}

export function OpenApi_DeleteByServiceId() {
  return applyDecorators(
    ApiOkResponse(),
    ApiInternalServerErrorResponse(),
    ServiceIdParam(),
  );
}

export function OpenApi_DeleteByServiceIdConfigIds() {
  return applyDecorators(
    ApiOkResponse(),
    ApiInternalServerErrorResponse(),
    ServiceIdParam(),
    ConfigIdParam(),
  );
}
