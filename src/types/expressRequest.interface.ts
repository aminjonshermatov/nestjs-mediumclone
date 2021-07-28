import { Request } from 'express';

import { UserEntity } from "@app/user/entities/user.entity";

export interface ExpressRequestInterface extends Request {
  user?: UserEntity
}
