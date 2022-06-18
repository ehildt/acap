import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthManagerController } from './auth-manager.controller';
import {
  AuthManagerUser,
  AuthManagerUserSchema,
} from './schemas/auth-manager-user.schema';
import { AuthManagerUserRepository } from './services/auth-manager-user.repository';
import { AuthManagerService } from './services/auth-manager.service';

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
  providers: [AuthManagerService, AuthManagerUserRepository],
})
export class AuthManagerModule {}
