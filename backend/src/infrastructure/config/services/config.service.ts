import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppEnv } from '../types/env.types';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get app(): AppEnv['app'] {
    return this.config.getOrThrow<AppEnv['app']>('env.app');
  }

  get database(): AppEnv['database'] {
    return this.config.getOrThrow<AppEnv['database']>('env.database');
  }

  get auth(): AppEnv['auth'] {
    return this.config.getOrThrow<AppEnv['auth']>('env.auth');
  }

  get api(): AppEnv['api'] {
    return this.config.getOrThrow<AppEnv['api']>('env.api');
  }

  get cookies(): AppEnv['cookies'] {
    return this.config.getOrThrow<AppEnv['cookies']>('env.cookies');
  }

  get url(): AppEnv['url'] {
    return this.config.getOrThrow<AppEnv['url']>('env.url');
  }

  get upload(): AppEnv['upload'] {
    return this.config.getOrThrow<AppEnv['upload']>('env.upload');
  }

  get mail(): AppEnv['mail'] {
    return this.config.getOrThrow<AppEnv['mail']>('env.mail');
  }
}
