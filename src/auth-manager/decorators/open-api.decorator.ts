import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthManagerLogoutReq } from '../dtos/auth-manager-logout-req.dto';
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
    ApiCreatedResponse(),
    ApiInternalServerErrorResponse(),
  );
}

export function OpenApi_Logout() {
  return applyDecorators(
    ApiBody({
      required: true,
      type: AuthManagerLogoutReq,
    }),
    ApiCreatedResponse(),
    ApiInternalServerErrorResponse(),
  );
}
