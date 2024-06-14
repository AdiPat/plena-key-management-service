import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { RegisterUserResponseDTO } from './dto';
import { KeyManagementService } from './key-management.service';
import { extractClaims } from './common';
import { User } from '@prisma/client';

@Controller('keys')
export class KeyManagementController {
  constructor(private readonly keyManagementService: KeyManagementService) {}

  @Post('user/register')
  @HttpCode(201)
  async registerUser(
    @Req() request: Request,
  ): Promise<RegisterUserResponseDTO> {
    const headers = request.headers;
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
    const claims = extractClaims(authHeader, process.env.JWT_SECRET);
    const userId = claims.data.userId;

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
}
