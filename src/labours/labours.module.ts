import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaboursService } from './labours.service';
import { LaboursController } from './labours.controller';
import { Labour } from './entities/labour.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Payment } from '../payments/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Labour, Attendance, Payment])],
  controllers: [LaboursController],
  providers: [LaboursService],
  exports: [LaboursService],
})
export class LaboursModule {}
