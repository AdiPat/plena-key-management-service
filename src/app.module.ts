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
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [],
  controllers: [AppController, KeyManagementController],
  providers: [PrismaService, AppService, KeyManagementService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'keys/user/register', method: RequestMethod.POST },
      {
        path: 'keys',
        method: RequestMethod.POST,
      },
    );
  }
}
