import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth-Manager')
@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() req: any) {
    return this.authService.signup(req);
  }

  @Post('signin')
  async signin(@Body() req: any) {
    return this.authService.signin(req);
  }

  @Post('logout')
  async logout(@Body() req: any) {
    return this.authService.logout(req);
  }

  @Post('refresh')
  async refresh(@Body() req: any) {
    return this.authService.refresh(req);
  }
}
