import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthManagerSignupReq } from '../dtos/auth-manager-signup-req.dto';
import { AuthManagerTokenReq } from '../dtos/auth-manager-token-req.dto';

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
