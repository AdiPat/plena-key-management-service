import { Injectable } from '@nestjs/common';
import { User, AccessKey, RateLimits } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { randomBytes } from 'crypto';
import { Constants } from '../common';

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
        expiry: Constants.DEFAULT_ACCESS_KEY_EXPIRY,
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

  async setRateLimit(accessKeyId: string, limit: number): Promise<RateLimits> {
    const key = await this.prismaService.accessKey.findFirst({
      where: {
        id: accessKeyId,
      },
    });

    if (!key) {
      throw new Error('Key not found');
    }

    const rateLimits = await this.prismaService.rateLimits.findFirst({
      where: {
        accessKeyId: key.id,
      },
    });

    if (!rateLimits) {
      throw new Error('Rate limits not found');
    }

    await this.prismaService.rateLimits.update({
      where: {
        id: rateLimits.id,
      },
      data: {
        limitPerSecond: limit,
      },
    });

    return rateLimits;
  }

  async setExpiry(accessKeyId: string, expiry: Date): Promise<AccessKey> {
    const key = await this.prismaService.accessKey.findFirst({
      where: {
        id: accessKeyId,
      },
    });

    if (!key) {
      throw new Error('Key not found');
    }

    await this.prismaService.accessKey.update({
      where: {
        id: key.id,
      },
      data: {
        expiry,
      },
    });

    return key;
  }

  async revokeAccessKey(accessKeyId: string): Promise<AccessKey> {
    const key = await this.prismaService.accessKey.findFirst({
      where: {
        id: accessKeyId,
      },
    });

    if (!key) {
      throw new Error('Key not found');
    }

    await this.prismaService.accessKey.update({
      where: {
        id: key.id,
      },
      data: {
        disabled: true,
      },
    });

    return key;
  }
}
