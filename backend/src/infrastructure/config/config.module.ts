import { validationSchema } from './schemas/validation.schema';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './env.config';
import { AppConfigService } from './services/config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      envFilePath: ['.env'],
      validationSchema,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
