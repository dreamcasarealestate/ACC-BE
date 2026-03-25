import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async markAttendance(createAttendanceDto: CreateAttendanceDto) {
    try {
      const attendance = this.attendanceRepository.create(createAttendanceDto);
      return await this.attendanceRepository.save(attendance);
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT' || error.code === '23505') {
        throw new ConflictException('Attendance for this labour on this date already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.attendanceRepository.find({ relations: ['labour'], order: { date: 'DESC' } });
  }

  async findByLabour(labourId: number) {
    return this.attendanceRepository.find({
      where: { labourId },
      relations: ['labour'],
      order: { date: 'DESC' },
    });
  }

  async update(id: number, payload: Partial<CreateAttendanceDto>) {
    await this.attendanceRepository.update(id, payload);
    return this.attendanceRepository.findOne({ where: { id }, relations: ['labour'] });
  }

  async remove(id: number) {
    return this.attendanceRepository.delete(id);
  }
}
