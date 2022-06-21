import { hash } from 'argon2';
import { validateOrReject } from 'class-validator';
import { Model } from 'mongoose';
import {
  InternalServerErrorException,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { AuthManagerController } from './auth-manager.controller';
import { AuthManagerSignupReq } from './dtos/auth-manager-signup-req.dto';
import {
  AuthManagerUser,
  AuthManagerUserDocument,
  AuthManagerUserSchema,
} from './schemas/auth-manager-user.schema';
import { AuthManagerUserRepository } from './services/auth-manager-user.repository';
import { AuthManagerService } from './services/auth-manager.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    // since we need two tokens,
    // we handle the jwt options in the auth service
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: AuthManagerUser.name, schema: AuthManagerUserSchema },
    ]),
  ],
  controllers: [AuthManagerController],
  providers: [
    AuthManagerService,
    AuthManagerUserRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthManagerModule implements OnModuleInit {
  constructor(
    @InjectModel(AuthManagerUser.name)
    private readonly authModal: Model<AuthManagerUserDocument>,
  ) {}

  async onModuleInit() {
    let document: AuthManagerSignupReq;

    try {
      document = new AuthManagerSignupReq({
        username: process.env.AUTH_MANAGER_USERNAME ?? 'superadmin',
        password: process.env.AUTH_MANAGER_PASSWORD ?? 'superadmin',
      });

      await validateOrReject(document);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('could not create superadmin');
    }

    try {
      await this.authModal.create({
        username: document.username,
        hash: await hash(document.password),
      });
    } catch {}
  }
}
