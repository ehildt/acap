import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignupBody } from './decorators/controller.decorators';
import { OpenApi_Singup } from './decorators/open-api.decorator';
import { AuthManagerSignupReq } from './dtos/auth-manager-signup-req.dto';
import { AuthManagerService } from './services/auth-manager.service';

@ApiTags('Auth-Manager')
@Controller('auths')
export class AuthManagerController {
  constructor(private readonly authManagerService: AuthManagerService) {}

  @Post('signup')
  @OpenApi_Singup()
  async signup(@SignupBody() req: AuthManagerSignupReq[]) {
    return this.authManagerService.signup(req);
  }

  @Get('users')
  async getUsers() {
    return this.authManagerService.getUsers();
  }

  @Post('signin')
  async signin(@Body() req: any) {
    return this.authManagerService.signin(req);
  }

  @Post('logout')
  async logout(@Body() req: any) {
    return this.authManagerService.logout(req);
  }

  @Post('refresh')
  async refresh(@Body() req: any) {
    return this.authManagerService.refresh(req);
  }
}
