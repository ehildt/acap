import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  ApiBodyAuthManagerElevate,
  ApiBodyAuthManagerSignin,
  ApiBodyAuthManagerSignup,
  ApiBodyAuthManagerUpdate,
  ApiBodyConsumerToken,
  ApiParamRole,
  ApiParamServiceId,
  ApiQueryEmail,
  ApiQueryPassword,
  ApiQueryUsername,
} from './open-api.method.decorator';

export function OpenApi_Singup() {
  return applyDecorators(
    ApiNoContentResponse(),
    ApiBodyAuthManagerSignup(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_Signin() {
  return applyDecorators(
    ApiOkResponse(),
    ApiBodyAuthManagerSignin(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_Update() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiNoContentResponse(),
    ApiBodyAuthManagerUpdate(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_Elevate() {
  return applyDecorators(
    ApiParamRole(),
    ApiBearerAuth(),
    ApiNoContentResponse(),
    ApiBodyAuthManagerElevate(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_ConsumerToken() {
  return applyDecorators(
    ApiOkResponse(),
    ApiBearerAuth(),
    ApiParamServiceId(),
    ApiBodyConsumerToken(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_Delete() {
  return applyDecorators(
    ApiNoContentResponse(),
    ApiBearerAuth(),
    ApiQueryEmail(),
    ApiQueryUsername(),
    ApiQueryPassword(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_Token() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiNoContentResponse(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_RefreshToken() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOkResponse(),
    ApiInternalServerErrorResponse(),
  );
}
