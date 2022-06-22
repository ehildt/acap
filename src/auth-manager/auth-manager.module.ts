import { hash } from 'argon2';
import RedisStore from 'cache-manager-ioredis';
import { validateOrReject } from 'class-validator';
import { Model } from 'mongoose';
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
import { AuthManagerController } from './auth-manager.controller';
import { redisCacheConfigFactory } from './configs/redis-cache/redis-cache-config-factory.dbs';
import { RedisCacheConfigRegistry } from './configs/redis-cache/redis-cache-config-registry.dbs';
import { superAdminClaims } from './constants/claims';
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
    ConfigModule.forRoot({
      cache: true,
      ignoreEnvFile: true,
      load: [RedisCacheConfigRegistry],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          store: RedisStore,
          ...redisCacheConfigFactory(config),
        };
      },
      inject: [ConfigService],
    }),
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
    ConsoleLogger,
  ],
})
export class AuthManagerModule implements OnModuleInit {
  constructor(
    @InjectModel(AuthManagerUser.name)
    private readonly authModal: Model<AuthManagerUserDocument>,
    private readonly logger: ConsoleLogger,
    private readonly configService: ConfigService,
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
        role: Role.superadmin,
        claims: superAdminClaims,
      });
    } catch (error) {
      if (error?.code !== 11000) console.error(error);
    }

    const REDIS_CONFIG = redisCacheConfigFactory(this.configService);

    if (process.env.PRINT_ENV)
      this.logger.log({ REDIS_CONFIG }, 'Config-Manager');
  }
}
