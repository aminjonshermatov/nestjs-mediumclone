import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProfileController } from "@app/profile/profile.controller";
import { ProfileService } from "@app/profile/profile.service";
import { UserEntity } from "@app/user/entities/user.entity";
import { FollowEntity } from "@app/profile/entities/follow.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule { }
