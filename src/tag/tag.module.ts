import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { TagController } from "@app/tag/tag.controller";
import { TagService } from "@app/tag/tag.service";
import { TagEntity } from "@app/tag/entities/tag.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagController],
  providers: [TagService]
})
export class TagModule { }
