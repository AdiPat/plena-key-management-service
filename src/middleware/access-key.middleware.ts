import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../core';

@Injectable()
export class AccessKeyMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;
    const apiKeyHeader = headers['x-api-key'];

    if (headers['authorization']) {
      // pass through, let the jwt middleware handle this
      console.log('passing through access key middleware');
      return next();
    }

    if (!apiKeyHeader) {
      console.log('Missing API key header');
      throw new HttpException(
        'Missing API key header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const accessKey = apiKeyHeader as string;

    const accessKeyRecord = await this.prismaService.accessKey.findFirst({
      where: {
        key: accessKey,
      },
    });

    if (!accessKeyRecord) {
      console.log('API key not found in DB. ');
      throw new HttpException('Invalid API key', HttpStatus.UNAUTHORIZED);
    }

    (req as any).accessKey = accessKeyRecord.key;
    (req as any).userId = accessKeyRecord.userId;
    (req as any).accessKeyId = accessKeyRecord.id;

    next();
  }
}
