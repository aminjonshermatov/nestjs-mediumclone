import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";

import { ExpressRequestInterface } from "@app/types/expressRequest.interface";
import { JWT_SECRET } from "@app/config";
import { UserService } from "@app/user/user.service";

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

    const [, token = ''] = req.headers.authorization.split(' ') || ['hi', ''];

    try {
      const decode = verify(token, JWT_SECRET);
      req.user = await this.userService.findById(decode.id || '') || null;
      next();
    } catch (e) {
      req.user = null;
      next();
    }
  }
}
