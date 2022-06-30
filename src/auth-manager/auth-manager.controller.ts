import { Body, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from './constants/role.enum';
import { Roles } from './decorators/controller.custom.decorator';
import {
  AccessTokenGuard,
  DeleteUser,
  PostLogout,
  PostRefresh,
  PostSignin,
  PutConsumerToken,
  PutElevate,
  PutSignup,
  PutUpdate,
  RefreshTokenGuard,
} from './decorators/controller.method.decorator';
import {
  ParamRole,
  ParamServiceId,
  QueryEmail,
  QueryPassword,
  QueryUsername,
  RawToken,
  Token,
} from './decorators/controller.parameter.decorator';
import {
  OpenApi_ConsumerToken,
  OpenApi_Delete,
  OpenApi_Elevate,
  OpenApi_RefreshToken,
  OpenApi_Signin,
  OpenApi_Singup,
  OpenApi_Token,
  OpenApi_Update,
} from './decorators/open-api.controller.decorator';
import { AuthManagerElevateReq } from './dtos/auth-manager-elevate-req.dto';
import { AuthManagerSigninReq } from './dtos/auth-manager-signin-req.dto';
import { AuthManagerSignupReq } from './dtos/auth-manager-signup-req.dto';
import { AuthManagerToken } from './dtos/auth-manager-token.dto';
import { AuthManagerUpdateReq } from './dtos/auth-manager-update-req.dto';
import { AuthManagerService } from './services/auth-manager.service';

@ApiTags('Auth-Manager')
@Controller('auths')
export class AuthManagerController {
  constructor(private readonly authManagerService: AuthManagerService) {}

  @PostSignin()
  @OpenApi_Signin()
  @HttpCode(HttpStatus.OK)
  signin(@Body() req: AuthManagerSigninReq) {
    return this.authManagerService.signin(req);
  }

  @PutSignup()
  @OpenApi_Singup()
  @HttpCode(HttpStatus.NO_CONTENT)
  signup(@Body() req: AuthManagerSignupReq) {
    return this.authManagerService.signup(req);
  }

  @PutUpdate()
  @OpenApi_Update()
  @AccessTokenGuard()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.superadmin, Role.moderator, Role.member)
  update(@Body() req: AuthManagerUpdateReq, @Token() token: AuthManagerToken) {
    return this.authManagerService.update(req, token);
  }

  @PostLogout()
  @AccessTokenGuard()
  @HttpCode(HttpStatus.NO_CONTENT)
  @OpenApi_Token()
  @Roles(Role.superadmin, Role.moderator, Role.member)
  logout(@Token() token: AuthManagerToken) {
    return this.authManagerService.logout(token);
  }

  @PostRefresh()
  @RefreshTokenGuard()
  @OpenApi_RefreshToken()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.superadmin, Role.moderator, Role.member)
  refresh(@Token() token: AuthManagerToken, @RawToken() rawToken: string) {
    return this.authManagerService.refresh(rawToken, token);
  }

  @DeleteUser()
  @OpenApi_Delete()
  @AccessTokenGuard()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.superadmin, Role.moderator, Role.member)
  async delete(
    @QueryEmail() email: string,
    @QueryUsername() username: string,
    @QueryPassword() password: string,
  ) {
    await this.authManagerService.delete(username, email, password);
  }

  @PutElevate()
  @OpenApi_Elevate()
  @AccessTokenGuard()
  @Roles(Role.superadmin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async elevate(
    @ParamRole() role: Role,
    @Token() token: AuthManagerToken,
    @Body() req: AuthManagerElevateReq,
  ) {
    await this.authManagerService.elevate(req, role, token);
  }

  @PutConsumerToken()
  @AccessTokenGuard()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.superadmin, Role.moderator)
  @OpenApi_ConsumerToken()
  consumerToken(
    @ParamServiceId() serviceId: string,
    @Body() req?: Record<string, any>,
  ) {
    return this.authManagerService.token(serviceId, req);
  }
}
