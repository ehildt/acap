import { argon2i, hash } from 'argon2';
import RedisStore from 'cache-manager-ioredis';
import { validateOrReject } from 'class-validator';
import { Model } from 'mongoose';
import { HttpModule } from '@nestjs/axios';
import {
  CacheModule,
  InternalServerErrorException,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { AuthManagerController } from './auth-manager.controller';
import { AuthManagerConfigRegistry } from './configs/auth-manager/auth-manager-config-registry.dbs';
import { ConfigFactoryService } from './configs/config-factory.service';
import { MongoConfigRegistry } from './configs/mongo/mongo-config-registry.dbs';
import { RedisConfigRegistry } from './configs/redis/redis-config-registry.dbs';
import { Role } from './constants/role.enum';
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
    HttpModule,
    JwtModule.register({}),
    ConfigModule.forRoot({
      cache: true,
      ignoreEnvFile: true,
      load: [
        MongoConfigRegistry,
        RedisConfigRegistry,
        AuthManagerConfigRegistry,
      ],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          store: RedisStore,
          ...new ConfigFactoryService(config).redis,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (service) => new ConfigFactoryService(service).mongo,
    }),
    MongooseModule.forFeature([
      {
        name: AuthManagerUser.name,
        schema: AuthManagerUserSchema,
        collection: 'auths',
      },
    ]),
  ],
  controllers: [AuthManagerController],
  providers: [
    AuthManagerService,
    AuthManagerUserRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    ConfigFactoryService,
  ],
})
export class AuthManagerModule implements OnModuleInit {
  constructor(
    @InjectModel(AuthManagerUser.name)
    private readonly authModal: Model<AuthManagerUserDocument>,
    private readonly configFactory: ConfigFactoryService,
  ) {}

  async onModuleInit() {
    let document: AuthManagerSignupReq;
    const config = this.configFactory.auth;

    try {
      document = new AuthManagerSignupReq({
        email: config.email,
        username: config.username,
        password: config.password,
      });

      await validateOrReject(document);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('could not create superadmin');
    }

    try {
      const user = await this.authModal.findOne({ role: Role.superadmin });

      if (!user)
        await this.authModal.create({
          username: document.username,
          email: document.email,
          hash: await hash(document.password, {
            type: argon2i,
          }),
          role: Role.superadmin,
        });
    } catch (error) {
      if (error?.code !== 11000) throw new InternalServerErrorException(error);
    }
  }
}
