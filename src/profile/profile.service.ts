import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ProfileType } from "@app/profile/types/profile.type";
import { ProfileResponseInterface } from "@app/profile/types/profileResponse.interface";
import { UserEntity } from "@app/user/user.entity";
import { FollowEntity } from "@app/profile/follow.entity";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>
  ) { }

  async getProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      username: profileUsername
    });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOne({
      followerId: currentUserId,
      followingId: user.id
    });

    return { ...user, following: Boolean(follow) };
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return { profile };
  }

  async followProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      username: profileUsername
    });

    if (!user) {
      throw new HttpException('Profile not found!', HttpStatus.NOT_FOUND);
    }

    if (user.id === currentUserId) {
      throw new HttpException('Follower anf following can`t be equal!', HttpStatus.BAD_REQUEST);
    }

    const follow = await this.followRepository.findOne({
      followerId: currentUserId,
      followingId: user.id
    });

    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id

      await this.followRepository.save(followToCreate);
    }

    return { ...user, following: true };
  }

  async unFollowProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      username: profileUsername
    });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    if (user.id === currentUserId) {
      throw new HttpException(
        'Follower and following can`t be equal',
        HttpStatus.BAD_REQUEST
      );
    }

    await this.followRepository.delete({
      followingId: user.id,
      followerId: currentUserId
    });

    return { ...user, following: false };
  }
}
