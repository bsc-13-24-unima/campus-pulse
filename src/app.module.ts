import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { TypeOrmModule } from '@nestjs/typeorm';

=======
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
>>>>>>> 20f0c811e49de58e0d307ab60d2c4c1051ecbfbf
import { UsersModule } from './modules/users/users.module';
import { LostFoundModule } from './modules/lost-found/lost-found.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { AdminModule } from './modules/admin/admin.module';
<<<<<<< HEAD
import { AuthModule } from './modules/auth/auth.module';
=======
import { OracleService } from './config/oracle.service';
>>>>>>> 20f0c811e49de58e0d307ab60d2c4c1051ecbfbf

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: 'localhost',
      port: 1521,
      username: 'C##CAMPUS_PULSE_USER',
      password: 'zaithwa28',
      sid: 'XE',

      autoLoadEntities: true,
      synchronize: false, // keep this FALSE since you created tables manually
    }),
<<<<<<< HEAD

=======
    AuthModule,
>>>>>>> 20f0c811e49de58e0d307ab60d2c4c1051ecbfbf
    UsersModule,
    LostFoundModule,
    AnnouncementsModule,
    AdminModule,
    AuthModule,
  ],
  providers: [OracleService],
  exports: [OracleService],
})
export class AppModule {}
