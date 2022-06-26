import { Body, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from './constants/role.enum';
import {
  AccessTokenGuard,
  PostConsumerToken,
  PostLogout,
  PostRefresh,
  PostSignin,
  PostSignup,
  QueryRefConfigIds,
  QueryRefServiceId,
  RawToken,
  RefreshTokenGuard,
  Roles,
  ServiceIdParam,
  Token,
} from './decorators/controller-properties.decorator';
import {
  OpenApi_ConsumerToken,
  OpenApi_Signin,
  OpenApi_Singup,
  OpenApi_Token,
} from './decorators/open-api.decorator';
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
  @OpenApi_Signin()
  @HttpCode(HttpStatus.OK)
  signin(
    @Body() req: AuthManagerSigninReq,
    @QueryRefServiceId() refServiceId?: string,
    @QueryRefConfigIds() refConfigIds?: string[],
  ) {
    return this.authManagerService.signin(req, refServiceId, refConfigIds);
  }

  @PostConsumerToken()
  @OpenApi_ConsumerToken()
  @AccessTokenGuard()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.superadmin, Role.moderator)
  consumerToken(
    @ServiceIdParam() serviceId: string,
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

  @PostLogout()
  @OpenApi_Token()
  @AccessTokenGuard()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.superadmin, Role.moderator, Role.member)
  logout(@Token() token: AuthManagerToken) {
    return this.authManagerService.logout(token);
  }

  @PostRefresh()
  @OpenApi_Token()
  @RefreshTokenGuard()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.superadmin, Role.moderator, Role.member)
  refresh(@Token() token: AuthManagerToken, @RawToken() rawToken: string) {
    return this.authManagerService.refresh(rawToken, token);
  }
}
