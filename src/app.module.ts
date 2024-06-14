import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
