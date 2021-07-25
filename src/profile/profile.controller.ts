import {
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Controller
} from "@nestjs/common";

import { User } from "@app/user/decorators/user.decorator";
import { ProfileResponseInterface } from "@app/profile/types/profileResponse.interface";
import { ProfileService } from "@app/profile/profile.service";
import { AuthGuard } from "@app/user/guards/auth.guard";

@Controller('profiles')
export class ProfileController {

  constructor(
    private readonly profileService: ProfileService
  ) { }

  @Get(':username')
  async getProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUsername: string
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(currentUserId, profileUsername);
    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUsername: string
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.followProfile(currentUserId, profileUsername);
    return this.profileService.buildProfileResponse(profile);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unFollowProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUsername: string
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.unFollowProfile(currentUserId, profileUsername);
    return this.profileService.buildProfileResponse(profile);
  }
}
