import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigManagerApi } from './api/config-manager.api';
import {
  OpenApi_Signin,
  OpenApi_Singup,
} from './decorators/open-api.decorator';
import { AuthManagerSigninReq } from './dtos/auth-manager-signin-req.dto';
import { AuthManagerSignupReq } from './dtos/auth-manager-signup-req.dto';
import { AuthManagerService } from './services/auth-manager.service';

@ApiTags('Auth-Manager')
@Controller('auths')
export class AuthManagerController {
  constructor(
    private readonly authManagerService: AuthManagerService,
    private readonly configManagerApi: ConfigManagerApi,
  ) {}

  @Post('signup')
  @OpenApi_Singup()
  async signup(@Body() req: AuthManagerSignupReq) {
    return this.authManagerService.signup(req);
  }

  @Post('signin')
  @OpenApi_Signin()
  async signin(
    @Body() req: AuthManagerSigninReq,
    @Query('refServiceId') refServiceId: string,
    @Query('refConfigIds') refConfigIds: string[],
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

  @Post('logout')
  async logout(@Body() req: string) {
    return this.authManagerService.logout(req);
  }

  @Post('refresh')
  async refresh(@Body() req: any) {
    return this.authManagerService.refresh(req);
  }
}
