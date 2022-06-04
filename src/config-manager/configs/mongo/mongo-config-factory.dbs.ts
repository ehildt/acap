import { ConfigService } from '@nestjs/config';

export function mongoConfigFactory(config: ConfigService) {
  return {
    uri: config.get<string>('MongoConfig.URI'),
    ssl: config.get<boolean>('MongoConfig.SSL'),
    sslValidate: config.get<boolean>('MongoConfig.SSL_VALIDATE'),
    dbName: config.get<string>('MongoConfig.DB_NAME'),
    user: config.get<string>('MongoConfig.USER'),
    pass: config.get<string>('MongoConfig.PASS'),
  };
}
