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
      isArray: true,
      required: true,
      type: AuthManagerSignupReq,
    }),
    ApiCreatedResponse(),
    ApiUnauthorizedResponse(),
    ApiInternalServerErrorResponse(),
  );
}
