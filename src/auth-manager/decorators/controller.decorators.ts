import { Body, ParseArrayPipe } from '@nestjs/common';
import { AuthManagerSignupReq } from '../dtos/auth-manager-signup-req.dto';

export const SignupBody = () =>
  Body(new ParseArrayPipe({ items: AuthManagerSignupReq }));
