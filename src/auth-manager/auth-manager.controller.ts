import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  PostLogout,
  PostRefresh,
  PostSignin,
  PostSignup,
  QueryRefConfigIds,
  QueryRefServiceId,
  Token,
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
    const result = await this.authManagerService.challengeOptionalConfigs(
      refServiceId,
      refConfigIds,
    );

    return this.authManagerService.signin(req, refServiceId, result);
  }

  @PostLogout()
  @OpenApi_Logout()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenAuthGuard)
  async logout(@Token() token: any) {
    return this.authManagerService.logout(token.username);
  }

  @PostRefresh()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenAuthGuard)
  async refresh(@Token() token: any) {
    return this.authManagerService.refresh(token);
  }
}
