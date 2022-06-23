import { ConfigService } from '@nestjs/config';

export interface AuthManagerConfig {
  username: string;
  password: string;
  accessTokenTTL: number;
  refreshTokenTTL: number;
  accessTokenSecret: string;
  refreshTokenSecret: string;
  configManagerBaseUrl: string;
}

export function authManagerConfigFactory(config: ConfigService) {
  return <AuthManagerConfig>{
    username: config.get<string>('AuthManagerConfig.USERNAME'),
    password: config.get<string>('AuthManagerConfig.PASSWORD'),
    accessTokenTTL: config.get<number>('AuthManagerConfig.ACCESS_TOKEN_TTL'),
    refreshTokenTTL: config.get<number>('AuthManagerConfig.REFRESH_TOKEN_TTL'),
    accessTokenSecret: config.get<string>(
      'AuthManagerConfig.ACCESS_TOKEN_SECRET',
    ),
    refreshTokenSecret: config.get<string>(
      'AuthManagerConfig.REFRESH_TOKEN_SECRET',
    ),
    configManagerBaseUrl: config.get<string>(
      'AuthManagerConfig.CONFIG_MANAGER_BASE_URL',
    ),
  };
}
