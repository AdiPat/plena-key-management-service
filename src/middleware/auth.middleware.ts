import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { extractClaims } from '../common';
import { PrismaService } from '../core';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;
    const authorizationHeader = headers['authorization'];
    const xApiKey = headers['x-api-key'];

    if (xApiKey) {
      // pass through, let the access key middleware handle this
      return next();
    }

    if (!authorizationHeader) {
      console.log('Missing authorization header');
      throw new HttpException(
        'Missing authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tokenType = authorizationHeader.split(' ')[0];

    if (tokenType !== 'Bearer') {
      throw new HttpException('Invalid token type', HttpStatus.BAD_REQUEST);
    }

    const authHeader = authorizationHeader.split(' ')[1];
    const claims = extractClaims(authHeader);
    const userId = claims?.data?.userId;

    if (!userId) {
      console.log('No userId in JWT token');
      throw new HttpException(
        'No userId in JWT token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    (req as any).userId = userId;

    next();
  }
}
