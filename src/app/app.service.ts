import { mongoConfigFactory } from '@/auth-manager/configs/mongo/mongo-config-factory.dbs';
import { redisConfigFactory } from '@/auth-manager/configs/redis/redis-config-factory.dbs';
import {
  ConsoleLogger,
  INestApplication,
  Injectable,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_DOCS, API_DOCS_JSON } from './app.constants';
import { appConfigFactory } from './configs/app-config-factory.dbs';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: ConsoleLogger,
  ) {}

  getConfig() {
    return {
      APP_CONFIG: appConfigFactory(this.configService),
      MONGO_CONFIG: mongoConfigFactory(this.configService),
      REDIS_CONFIG: redisConfigFactory(this.configService),
    };
  }

  useGlobalPipes(app: INestApplication) {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: false,
        },
      }),
    );
  }

  enableVersioning(app: INestApplication) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
      prefix: 'api/v',
    });
  }

  enableOpenApi(app: INestApplication) {
    const { APP_CONFIG } = this.getConfig();
    if (APP_CONFIG.startSwagger) {
      const pickOpenApiObj = this.swaggerDocument();
      const openApiObj = SwaggerModule.createDocument(app, pickOpenApiObj);
      SwaggerModule.setup(API_DOCS, app, openApiObj, {
        swaggerOptions: {
          persistAuthorization: true,
          explorer: true,
          tagsSorter: 'alpha',
        },
      });
    }
  }

  logOnServerStart() {
    const config = this.getConfig();

    if (process.env.PRINT_ENV) this.logger.log(config, 'App-Configs');

    if (config.APP_CONFIG.startSwagger) {
      const { nodeEnv, httpProtocol, host, port } = config.APP_CONFIG;
      const swaggerPath = `(${nodeEnv}) => ${httpProtocol}://${host}:${port}`;
      this.logger.log(`${swaggerPath}/${API_DOCS_JSON}`);
      this.logger.log(`${swaggerPath}/${API_DOCS}`);
    }
  }

  private swaggerDocument() {
    return new DocumentBuilder()
      .setTitle('Config-Manager')
      .setDescription('A simple and convenient way to config your apps ;)')
      .setVersion('1.0')
      .addBearerAuth({
        in: 'header',
        type: 'http',
      })
      .build();
  }
}
