import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { RegisterUserResponseDTO } from './dto';
import { KeyManagementService } from './key-management.service';
import { User } from '@prisma/client';

@Controller('keys')
export class KeyManagementController {
  constructor(private readonly keyManagementService: KeyManagementService) {}

  @Post('user/register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(
    @Req() request: Request,
  ): Promise<RegisterUserResponseDTO> {
    const userId = (request as any).userId;

    const user: User = {
      id: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdUser = await this.keyManagementService.registerUser(user);

    return {
      userId: createdUser.id,
      createdAt: createdUser.createdAt,
    };
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createAccessKey(@Req() request: Request): Promise<any> {
    const body = await request.json();
    const userId = body.userId;

    if (!userId) {
      throw new HttpException('Missing userId', HttpStatus.BAD_REQUEST);
    }

    return this.keyManagementService.generateKey(userId);
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getAllAccessKeys(@Req() request: Request): Promise<any> {
    const userId = (request as any).userId;

    if (!userId) {
      throw new HttpException('Missing userId', HttpStatus.BAD_REQUEST);
    }

    return this.keyManagementService.listKeys(userId);
  }

  @Post('/:keyId/rate-limit')
  @HttpCode(HttpStatus.OK)
  async updateRateLimits(
    @Param('keyId') keyId: string,
    @Body() body: { limit: number },
  ): Promise<any> {
    const limit = body.limit;

    if (!keyId || !limit) {
      throw new HttpException('Missing keyId or limit', HttpStatus.BAD_REQUEST);
    }

    return this.keyManagementService.setRateLimit(keyId, limit);
  }

  @Post('/:keyId/expiry')
  @HttpCode(HttpStatus.OK)
  async updateExpiry(
    @Param('keyId') keyId: string,
    @Body() body: { expiry: Date },
  ): Promise<any> {
    const expiry = body.expiry;

    if (!keyId || !expiry) {
      throw new HttpException('Missing keyId or limit', HttpStatus.BAD_REQUEST);
    }

    return this.keyManagementService.setExpiry(keyId, expiry);
  }

  @Post('/:keyId/revoke')
  @HttpCode(HttpStatus.OK)
  async revokeKey(@Param('keyId') key): Promise<any> {
    if (!key) {
      throw new HttpException('Missing keyId', HttpStatus.BAD_REQUEST);
    }

    return this.keyManagementService.revokeAccessKey(key);
  }
}
