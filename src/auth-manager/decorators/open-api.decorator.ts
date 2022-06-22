import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthManagerSigninReq } from '../dtos/auth-manager-signin-req.dto';
import { AuthManagerSignupReq } from '../dtos/auth-manager-signup-req.dto';
import { AuthManagerTokenReq } from '../dtos/auth-manager-token-req.dto';

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
    ApiCreatedResponse(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_Token() {
  return applyDecorators(
    ApiBody({
      required: true,
      type: AuthManagerTokenReq,
    }),
    ApiCreatedResponse(),
    ApiUnauthorizedResponse(),
    ApiInternalServerErrorResponse(),
  );
}
