import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AssetsModule } from './modules/assets/assets.module';
import { DexModule } from './modules/dex/dex.module';

@Module({
  imports: [
    AssetsModule,
    DexModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
