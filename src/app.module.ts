import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LostFoundModule } from './modules/lost-found/lost-found.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { AdminModule } from './modules/admin/admin.module';
import { User } from './modules/users/entities/user.entity';
import { Announcement } from './modules/announcements/entities/announcement.entity';
import { LostFoundItem } from './modules/lost-found/entities/lost-found-item.entity';
import { Claim } from './modules/lost-found/entities/claim.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'oracle',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT')),
        serviceName: configService.get('DB_SERVICE_NAME'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        entities: [User, Announcement, LostFoundItem, Claim],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    LostFoundModule,
    AnnouncementsModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}