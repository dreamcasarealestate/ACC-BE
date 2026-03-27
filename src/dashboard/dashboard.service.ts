import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Labour } from '../labours/entities/labour.entity';
import { Attendance, AttendanceStatus } from '../attendance/entities/attendance.entity';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Labour)
    private laboursRepository: Repository<Labour>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async getSummary(dateParam?: string) {
    const today = dateParam ? new Date(dateParam) : new Date();
    const day = new Date(today);

    const toDateString = (d: Date) => d.toISOString().slice(0, 10);
    const todayStr = toDateString(day);

    const weekStart = new Date(day);
    const weekday = weekStart.getDay(); // 0 = Sunday
    const mondayOffset = weekday === 0 ? -6 : 1 - weekday;
    weekStart.setDate(weekStart.getDate() + mondayOffset);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const weekStartStr = toDateString(weekStart);
    const weekEndStr = toDateString(weekEnd);

    const monthStart = new Date(day.getFullYear(), day.getMonth(), 1);
    const monthEnd = new Date(day.getFullYear(), day.getMonth() + 1, 0);
    const monthStartStr = toDateString(monthStart);
    const monthEndStr = toDateString(monthEnd);

    const totalLabour = await this.laboursRepository.count();

    const allAttendance = await this.attendanceRepository.find();
    const attendancesToday = allAttendance.filter((a) => String(a.date).slice(0, 10) === todayStr);

    const todayPresent = attendancesToday.filter(a => a.status === AttendanceStatus.PRESENT).length;
    const todayAbsent = attendancesToday.filter(a => a.status === AttendanceStatus.ABSENT).length;

    const allPayments = await this.paymentsRepository.find();
    const pendingPayments = allPayments.filter(
      (p) =>
        (p.status === PaymentStatus.PENDING || p.status === PaymentStatus.PARTIAL) &&
        Number(p.balanceAmount) > 0,
    );

    const totalPendingAmount = pendingPayments.reduce((sum, p) => sum + Number(p.balanceAmount), 0);
    const weeklyPayableAmount = pendingPayments
      .filter((p) => {
        const periodStart = String(p.periodStart).slice(0, 10);
        return periodStart >= weekStartStr && periodStart <= weekEndStr;
      })
      .reduce((sum, p) => sum + Number(p.balanceAmount), 0);
    const monthlyPayableAmount = pendingPayments
      .filter((p) => {
        const periodStart = String(p.periodStart).slice(0, 10);
        return periodStart >= monthStartStr && periodStart <= monthEndStr;
      })
      .reduce((sum, p) => sum + Number(p.balanceAmount), 0);

    return {
      totalLabour,
      todayPresent,
      todayAbsent,
      pendingSettlementsCount: pendingPayments.length,
      payableAmount: totalPendingAmount,
      weeklyPayableAmount,
      monthlyPayableAmount,
    };
  }
}
