import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthManagerSigninReq } from '../dtos/auth-manager-signin-req.dto';
import { AuthManagerSignupReq } from '../dtos/auth-manager-signup-req.dto';

export const ApiBodyAuthManagerSignup = () =>
  ApiBody({
    required: true,
    type: AuthManagerSignupReq,
  });

export const ApiBodyAuthManagerSignin = () =>
  ApiBody({
    required: true,
    type: AuthManagerSigninReq,
  });

export const ApiParamServiceId = () => ApiParam({ name: 'serviceId' });

export const ApiQueryRefConfigIds = () =>
  ApiQuery({ name: 'refConfigIds', isArray: true, required: false });

export const ApiQueryRefServiceId = () =>
  ApiQuery({ name: 'refServiceId', required: false });

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
