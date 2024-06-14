import { Injectable } from '@nestjs/common';
import { User, AccessKey, RateLimits } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class KeyManagementService {
  constructor(private prismaService: PrismaService) {}

  async registerUser(user: User): Promise<User> {
    const userCreated = await this.prismaService.user.create({
      data: {
        id: user.id,
      },
    });
    return userCreated;
  }

  async generateKey(
    userId: string,
  ): Promise<{ accessKey: AccessKey; rateLimits: RateLimits }> {
    const key = randomBytes(32).toString('hex'); // Generates a 64 characters long hexadecimal string

    const accessKey = await this.prismaService.accessKey.create({
      data: {
        userId: userId,
        key,
      },
    });

    const rateLimits = await this.prismaService.rateLimits.create({
      data: {
        accessKeyId: accessKey.id,
        limitPerSecond: 100,
      },
    });

    return {
      accessKey,
      rateLimits,
    };
  }

  async listKeys(userId: string): Promise<AccessKey[]> {
    const keys = await this.prismaService.accessKey.findMany({
      where: {
        userId,
      },
    });

    return keys;
  }
}
