import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

declare module 'express' {
  interface Request {
    currentUser: User;
  }
}
@Injectable()
export class CurrentUserMiddleWare implements NestMiddleware {
  constructor(private userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      console.log(userId, '*******');
      const user = await this.userService.findOne(userId);

      req.currentUser = user;
    }

    next();
  }
}
