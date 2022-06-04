import {
  INestApplication,
  Injectable,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { appConfigFactory } from './app.config.dbs';
import { API_DOCS } from './app.constants';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

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

  private swaggerDocument() {
    return new DocumentBuilder()
      .setTitle('EEAGLE-RDP2')
      .setDescription('please provide some description')
      .setVersion('1.0')
      .addBearerAuth({
        in: 'header',
        type: 'http',
      })
      .build();
  }

  enableOpenApi(app: INestApplication) {
    const { swaggerAutoStart } = appConfigFactory(this.configService);

    if (swaggerAutoStart) {
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
}
