import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config as loadEnv } from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { Labour } from './labours/entities/labour.entity';
import { Attendance } from './attendance/entities/attendance.entity';
import { Payment } from './payments/entities/payment.entity';
import { Project } from './projects/entities/project.entity';

import { UsersModule } from './users/users.module';
import { LaboursModule } from './labours/labours.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProjectsModule } from './projects/projects.module';

const nodeEnv = process.env.NODE_ENV || 'development';
loadEnv({ path: `.env.${nodeEnv}` });

if (!process.env.POSTGRES_URL) {
  throw new Error(`POSTGRES_URL is missing. Please set it in .env.${nodeEnv}`);
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL,
      entities: [User, Labour, Attendance, Payment, Project],
      synchronize: true, // true for dev
    }),
    UsersModule,
    LaboursModule,
    AttendanceModule,
    PaymentsModule,
    AuthModule,
    DashboardModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
