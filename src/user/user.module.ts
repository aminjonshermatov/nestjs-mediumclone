import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "@app/user/entities/user.entity";
import { UserService } from "@app/user/user.service";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UserController } from "@app/user/user.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [UserService]
})
export class UserModule { }
