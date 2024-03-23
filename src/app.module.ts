import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AssetsModule } from './modules/assets/assets.module';
import { DexModule } from './modules/dex/dex.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AssetsModule,
    DexModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
