import { hash } from 'argon2';
import RedisStore from 'cache-manager-ioredis';
import { validateOrReject } from 'class-validator';
import { Model } from 'mongoose';
import { HttpModule } from '@nestjs/axios';
import {
  CacheModule,
  ConsoleLogger,
  InternalServerErrorException,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { ConfigManagerApi } from './api/config-manager.api';
import { AuthManagerController } from './auth-manager.controller';
import {
  AuthManagerConfig,
  authManagerConfigFactory,
} from './configs/auth-manager/auth-manager-config-factory.dbs';
import { AuthManagerConfigRegistry } from './configs/auth-manager/auth-manager-config-registry.dbs';
import { mongoConfigFactory } from './configs/mongo/mongo-config-factory.dbs';
import { MongoConfigRegistry } from './configs/mongo/mongo-config-registry.dbs';
import { redisConfigFactory } from './configs/redis/redis-config-factory.dbs';
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
          ...redisConfigFactory(config),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mongoConfigFactory,
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
    ConsoleLogger,
    ConfigManagerApi,
  ],
})
export class AuthManagerModule implements OnModuleInit {
  #config: AuthManagerConfig;
  constructor(
    @InjectModel(AuthManagerUser.name)
    private readonly authModal: Model<AuthManagerUserDocument>,
    private readonly logger: ConsoleLogger,
    private readonly configService: ConfigService,
  ) {}

  private get config() {
    if (this.#config) return this.#config;
    return (this.#config = authManagerConfigFactory(this.configService));
  }

  async onModuleInit() {
    let document: AuthManagerSignupReq;

    try {
      document = new AuthManagerSignupReq({
        email: this.config.email,
        username: this.config.username,
        password: this.config.password,
      });

      await validateOrReject(document);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('could not create superadmin');
    }

    try {
      await this.authModal.create({
        username: document.username,
        email: document.email,
        hash: await hash(document.password),
        role: Role.superadmin,
      });
    } catch (error) {
      if (error?.code !== 11000) throw new InternalServerErrorException(error);
    }

    const REDIS_CONFIG = redisConfigFactory(this.configService);
    const AUTH_MANAGER_CONFIG = authManagerConfigFactory(this.configService);
    const MONGO_CONFIG = mongoConfigFactory(this.configService);

    if (process.env.PRINT_ENV)
      this.logger.log(
        { REDIS_CONFIG, MONGO_CONFIG, AUTH_MANAGER_CONFIG },
        'Auth-Manager',
      );
  }
}
