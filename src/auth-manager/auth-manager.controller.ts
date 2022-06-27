import { Body, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from './constants/role.enum';
import { Roles } from './decorators/controller.custom.decorator';
import {
  AccessTokenGuard,
  PostConsumerToken,
  PostLogout,
  PostRefresh,
  PostSignin,
  PostSignup,
  RefreshTokenGuard,
} from './decorators/controller.method.decorator';
import {
  ParamServiceId,
  QueryRefConfigIds,
  QueryRefServiceId,
  RawToken,
  Token,
} from './decorators/controller.parameter.decorator';
import {
  OpenApi_ConsumerToken,
  OpenApi_Signin,
  OpenApi_Singup,
  OpenApi_Token,
} from './decorators/open-api.controller.decorator';
import { AuthManagerSigninReq } from './dtos/auth-manager-signin-req.dto';
import { AuthManagerSignupReq } from './dtos/auth-manager-signup-req.dto';
import { AuthManagerToken } from './dtos/auth-manager-token.dto';
import { AuthManagerService } from './services/auth-manager.service';

@ApiTags('Auth-Manager')
@Controller('auths')
export class AuthManagerController {
  constructor(private readonly authManagerService: AuthManagerService) {}

  @PostSignup()
  @OpenApi_Singup()
  signup(@Body() req: AuthManagerSignupReq) {
    return this.authManagerService.signup(req);
  }

  @PostSignin()
  @HttpCode(HttpStatus.OK)
  @OpenApi_Signin()
  signin(@Body() req: AuthManagerSigninReq) {
    return this.authManagerService.signin(req);
  }

  @PostLogout()
  @AccessTokenGuard()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.superadmin, Role.moderator, Role.member)
  @OpenApi_Token()
  logout(@Token() token: AuthManagerToken) {
    return this.authManagerService.logout(token);
  }

  @PostRefresh()
  @RefreshTokenGuard()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.superadmin, Role.moderator, Role.member)
  @OpenApi_Token()
  refresh(@Token() token: AuthManagerToken, @RawToken() rawToken: string) {
    return this.authManagerService.refresh(rawToken, token);
  }

  @PostConsumerToken()
  @AccessTokenGuard()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.superadmin, Role.moderator)
  @OpenApi_ConsumerToken()
  consumerToken(
    @ParamServiceId() serviceId: string,
    @QueryRefServiceId() refServiceId?: string,
    @QueryRefConfigIds() refConfigIds?: string[],
    @Body() req?: Record<string, any>,
  ) {
    return this.authManagerService.token(
      serviceId,
      refServiceId,
      refConfigIds,
      req,
    );
  }
}
