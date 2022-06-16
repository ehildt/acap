import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Role } from '../constants/role.enum';
import { AuthManagerElevateReq } from '../dtos/auth-manager-elevate-req.dto';
import { AuthManagerSigninReq } from '../dtos/auth-manager-signin-req.dto';
import { AuthManagerSignupReq } from '../dtos/auth-manager-signup-req.dto';
import { AuthManagerUpdateReq } from '../dtos/auth-manager-update-req.dto';

export const ApiBodyAuthManagerSignup = () =>
  ApiBody({
    required: true,
    type: AuthManagerSignupReq,
  });

export const ApiBodyAuthManagerUpdate = () =>
  ApiBody({
    required: true,
    type: AuthManagerUpdateReq,
  });

export const ApiParamRole = () =>
  ApiParam({
    enum: [Role.moderator, Role.member],
    name: 'role',
  });

export const ApiBodyAuthManagerElevate = () =>
  ApiBody({
    required: true,
    type: AuthManagerElevateReq,
  });

export const ApiBodyAuthManagerSignin = () =>
  ApiBody({
    required: true,
    type: AuthManagerSigninReq,
  });

export const ApiParamServiceId = () => ApiParam({ name: 'serviceId' });

export const ApiQueryUsername = () => ApiQuery({ name: 'username' });
export const ApiQueryPassword = () => ApiQuery({ name: 'password' });
export const ApiQueryEmail = () => ApiQuery({ name: 'email' });

export const ApiBodyConsumerToken = () =>
  ApiBody({
    schema: {
      type: 'object',
      title: 'ConsumerTokenData',
      example: {
        description: 'this object will be injected and available as jwt.data',
      },
    },
  });
