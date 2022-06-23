import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigManagerApi } from './api/config-manager.api';
import {
  PostLogout,
  PostRefresh,
  PostSignin,
  PostSignup,
  QueryRefConfigIds,
  QueryRefServiceId,
} from './decorators/controller-properties.decorator';
import {
  OpenApi_Logout,
  OpenApi_Signin,
  OpenApi_Singup,
} from './decorators/open-api.decorator';
import { AuthManagerSigninReq } from './dtos/auth-manager-signin-req.dto';
import { AuthManagerSignupReq } from './dtos/auth-manager-signup-req.dto';
import { AccessTokenAuthGuard } from './guards/auth-manager-access-token.guard';
import { AuthManagerService } from './services/auth-manager.service';

@ApiTags('Auth-Manager')
@Controller('auths')
export class AuthManagerController {
  constructor(
    private readonly authManagerService: AuthManagerService,
    private readonly configManagerApi: ConfigManagerApi,
  ) {}

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
    let result: Record<string, unknown>;

    if (refServiceId && refConfigIds?.length)
      result = await this.configManagerApi.getConfigIds(
        refServiceId,
        refConfigIds,
      );
    else if (refServiceId)
      result = await this.configManagerApi.getServiceId(refServiceId);

    return this.authManagerService.signin(req, refServiceId, result);
  }

  @UseGuards(AccessTokenAuthGuard)
  @PostLogout()
  @OpenApi_Logout()
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: { user: any }) {
    return this.authManagerService.logout(req.user.username);
  }

  @UseGuards(AccessTokenAuthGuard)
  @PostRefresh()
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() req: any) {
    return this.authManagerService.refresh(req);
  }
}
