import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeyManagementController } from './key-management.controller';
import { KeyManagementService } from './key-management.service';
import { PrismaService } from './prisma.service';
import { AccessKeyMiddleware, AuthMiddleware } from '../middleware';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 1000, // NOTE: static limits for this service, the token service uses dynamic limits
      },
    ]),
  ],
  controllers: [AppController, KeyManagementController],
  providers: [PrismaService, AppService, KeyManagementService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(KeyManagementController);
    consumer.apply(AccessKeyMiddleware).forRoutes(KeyManagementController);
  }
}
