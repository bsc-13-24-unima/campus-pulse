import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LostFoundModule } from './modules/lost-found/lost-found.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { AdminModule } from './modules/admin/admin.module';
import { OracleService } from './config/oracle.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    LostFoundModule,
    AnnouncementsModule,
    AdminModule,
  ],
  providers: [OracleService],
  exports: [OracleService],
})
export class AppModule {}
