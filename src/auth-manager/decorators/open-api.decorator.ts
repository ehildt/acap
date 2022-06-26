import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthManagerSigninReq } from '../dtos/auth-manager-signin-req.dto';
import { AuthManagerSignupReq } from '../dtos/auth-manager-signup-req.dto';

AuthManagerSigninReq;

export function OpenApi_Singup() {
  return applyDecorators(
    ApiBody({
      required: true,
      type: AuthManagerSignupReq,
    }),
    ApiCreatedResponse(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_Signin() {
  return applyDecorators(
    ApiBody({
      required: true,
      type: AuthManagerSigninReq,
    }),
    ApiQuery({ name: 'refConfigIds', isArray: true, required: false }),
    ApiQuery({ name: 'refServiceId', required: false }),
    ApiOkResponse(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_ConsumerToken() {
  return applyDecorators(
    ApiBody({
      schema: {
        type: 'object',
        title: 'ConsumerTokenData',
        example: { 'this object': 'will be injected into the token.data' },
      },
    }),
    ApiParam({ name: 'serviceId' }),
    ApiQuery({ name: 'refConfigIds', isArray: true, required: false }),
    ApiQuery({ name: 'refServiceId', required: false }),
    ApiOkResponse(),
    ApiInternalServerErrorResponse(),
    ApiBearerAuth(),
  );
}

export function OpenApi_Token() {
  return applyDecorators(
    ApiOkResponse(),
    ApiInternalServerErrorResponse(),
    ApiBearerAuth(),
  );
}
