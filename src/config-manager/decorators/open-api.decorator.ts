import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ConfigManagerUpsertReq } from '../dtos/config-manager-upsert-req.dto';
import { ConfigManagerUpsertRes } from '../dtos/config-manager-upsert-res.dto';

export function OpenApi_Upsert() {
  return applyDecorators(
    ApiBody({
      required: true,
      type: ConfigManagerUpsertReq,
      isArray: true,
      description: 'system config request example',
    }),
    ApiCreatedResponse(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_GetByConfigId() {
  return applyDecorators(
    ApiResponse({ type: ConfigManagerUpsertRes }),
    ApiInternalServerErrorResponse(),
  );
}

// eslint-disable-next-line sonarjs/no-identical-functions
export function OpenApi_GetByServiceId() {
  return applyDecorators(
    ApiResponse({ type: ConfigManagerUpsertRes }),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_DeleteByServiceId() {
  return applyDecorators(ApiOkResponse(), ApiInternalServerErrorResponse());
}

// eslint-disable-next-line sonarjs/no-identical-functions
export function OpenApi_DeleteByConfigIds() {
  return applyDecorators(
    ApiOkResponse(),
    ApiInternalServerErrorResponse(),
    ApiParam({ name: 'configIds', type: String }),
  );
}
