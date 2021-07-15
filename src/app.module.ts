import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from "@app/tag/tag.module";
import * as ormConfig from "@app/ormconfig";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig.config),
    TagModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
