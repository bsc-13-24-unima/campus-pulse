import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './modules/users/users.module';
import { LostFoundModule } from './modules/lost-found/lost-found.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: 'localhost',
      port: 1521,
      username: 'CAMPUS_PULSE_USER',
      password: 'zaithwa28',
      serviceName: 'XEPDB1',

      autoLoadEntities: true,
      synchronize: false, // keep this FALSE since you created tables manually
    }),

    UsersModule,
    LostFoundModule,
    AnnouncementsModule,
    AdminModule,
    AuthModule,
  ],
})
export class AppModule {}