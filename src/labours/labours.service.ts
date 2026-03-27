import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Labour } from './entities/labour.entity';
import { CreateLabourDto } from './dto/create-labour.dto';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Payment } from '../payments/entities/payment.entity';

@Injectable()
export class LaboursService {
  constructor(
    @InjectRepository(Labour)
    private laboursRepository: Repository<Labour>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async create(createLabourDto: CreateLabourDto): Promise<Labour> {
    const labour = this.laboursRepository.create(createLabourDto);
    return this.laboursRepository.save(labour);
  }

  async findAll(): Promise<Labour[]> {
    return this.laboursRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Labour | null> {
    return this.laboursRepository.findOneBy({ id });
  }

  async update(id: number, payload: Partial<CreateLabourDto>) {
    await this.laboursRepository.update(id, payload);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.laboursRepository.manager.transaction(async (manager) => {
      // Detach labour from project join table before deleting labour record.
      await manager
        .createQueryBuilder()
        .delete()
        .from('project_labours')
        .where('"labourId" = :id', { id })
        .execute();

      await manager.delete(Attendance, { labourId: id });
      await manager.delete(Payment, { labourId: id });
      return manager.delete(Labour, { id });
    });
  }
}
