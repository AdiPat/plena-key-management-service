import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from './prisma.service';

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
}
