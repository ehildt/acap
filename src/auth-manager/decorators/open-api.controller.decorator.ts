import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  ApiBodyAuthManagerSignin,
  ApiBodyAuthManagerSignup,
  ApiBodyConsumerToken,
  ApiParamServiceId,
  ApiQueryRefConfigIds,
  ApiQueryRefServiceId,
} from './open-api.method.decorator';

export function OpenApi_Singup() {
  return applyDecorators(
    ApiCreatedResponse(),
    ApiBodyAuthManagerSignup(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_Signin() {
  return applyDecorators(
    ApiOkResponse(),
    ApiQueryRefConfigIds(),
    ApiQueryRefServiceId(),
    ApiBodyAuthManagerSignin(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_ConsumerToken() {
  return applyDecorators(
    ApiOkResponse(),
    ApiBearerAuth(),
    ApiParamServiceId(),
    ApiBodyConsumerToken(),
    ApiQueryRefConfigIds(),
    ApiQueryRefServiceId(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_Token() {
  return applyDecorators(
    ApiOkResponse(),
    ApiBearerAuth(),
    ApiInternalServerErrorResponse(),
  );
}
