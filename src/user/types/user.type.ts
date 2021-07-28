import { UserEntity } from "@app/user/entities/user.entity";

export type UserType = Omit<UserEntity, 'hashPassword' | 'id' | 'password'>;
