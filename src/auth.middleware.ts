import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { extractClaims } from './common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;
    const authorizationHeader = headers['authorization'];

    if (!authorizationHeader) {
      throw new HttpException(
        'Missing authorization header',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokenType = authorizationHeader.split(' ')[0];

    if (tokenType !== 'Bearer') {
      throw new HttpException('Invalid token type', HttpStatus.BAD_REQUEST);
    }

    const authHeader = authorizationHeader.split(' ')[1];
    const claims = extractClaims(authHeader);
    const userId = claims.data.userId;

    (req as any).userId = userId;

    next();
  }
}
