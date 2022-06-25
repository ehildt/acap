import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from './constants/role.enum';
import {
  AccessTokenGuard,
  PostLogout,
  PostRefresh,
  PostSignin,
  PostSignup,
  QueryRefConfigIds,
  QueryRefServiceId,
  RawToken,
  RefreshTokenGuard,
  Roles,
  Token,
} from './decorators/controller-properties.decorator';
import {
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
  async signup(@Body() req: AuthManagerSignupReq) {
    return this.authManagerService.signup(req);
  }

  @PostSignin()
  @OpenApi_Signin()
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() req: AuthManagerSigninReq,
    @QueryRefServiceId() refServiceId?: string,
    @QueryRefConfigIds() refConfigIds?: string[],
  ) {
    try {
      const result = await this.authManagerService.challengeOptionalConfigs(
        refServiceId,
        refConfigIds,
      );

      return this.authManagerService.signin(req, refServiceId, result);
    } catch (error) {
      if (error?.response?.data)
        throw new UnprocessableEntityException(error?.response.data);
      throw new InternalServerErrorException(error);
    }
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
