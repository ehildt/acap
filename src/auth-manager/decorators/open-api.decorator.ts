import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthManagerSignupReq } from '../dtos/auth-manager-signup-req.dto';

export function OpenApi_Singup() {
  return applyDecorators(
    ApiBody({
      required: true,
      type: AuthManagerSignupReq,
      isArray: true,
    }),
    ApiCreatedResponse(),
    ApiUnauthorizedResponse(),
    ApiInternalServerErrorResponse(),
  );
}
