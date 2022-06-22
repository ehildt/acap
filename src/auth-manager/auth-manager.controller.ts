import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  OpenApi_Signin,
  OpenApi_Singup,
  OpenApi_Token,
} from './decorators/open-api.decorator';
import { AuthManagerSignupReq } from './dtos/auth-manager-signup-req.dto';
import { AuthManagerTokenReq } from './dtos/auth-manager-token-req.dto';
import { AuthManagerService } from './services/auth-manager.service';

@ApiTags('Auth-Manager')
@Controller('auths')
export class AuthManagerController {
  constructor(private readonly authManagerService: AuthManagerService) {}

  @Post('signup')
  @OpenApi_Singup()
  async signup(@Body() req: AuthManagerSignupReq) {
    return this.authManagerService.signup(req);
  }

  @Post('signin')
  @OpenApi_Signin()
  async signin(@Body() req: AuthManagerSignupReq) {
    return this.authManagerService.signin(req);
  }

  @Post('logout/:username')
  async logout(@Param('username') req: string) {
    return this.authManagerService.logout(req);
  }

  @Post('refresh')
  async refresh(@Body() req: any) {
    return this.authManagerService.refresh(req);
  }

  @Post('token')
  @OpenApi_Token()
  async elevate(@Body() req: AuthManagerTokenReq) {
    return this.authManagerService.token(req, {
      expiresIn: null,
      audience: ['service one', 'service two'],
      secret: process.env.AUTH_MANAGER_ACCESS_TOKEN_SECRET,
    });
    // return this.authManagerService.signup(req);
  }
}
