import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";

import { ExpressRequestInterface } from "@app/types/expressRequest.interface";
import { UserService } from "@app/user/user.service";
import { JWT_SECRET } from "@app/config";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(
    private readonly userService: UserService
  ) { }

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction): Promise<any> {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    // sample example of authorization header:
    // Authorization: Token jwt.token.here
    const result = (req.headers.authorization || '').split(' ');

    if (!result || result.length < 2 || result[0] !== 'Token') {
      req.user = null;
      next();
    }

    try {
      const decode = verify(result[1], JWT_SECRET);
      req.user = await this.userService.findById(decode.id || '') || null;
      next();
    } catch (e) {
      req.user = null;
      next();
    }
  }
}
