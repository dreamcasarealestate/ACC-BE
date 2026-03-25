import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  private applyPaymentRules(
    payment: Payment,
    options?: { manualBalance?: number; manualStatus?: PaymentStatus },
  ) {
    const advance = Number(payment.advanceAmount || 0);
    const paid = Number(payment.paidAmount || 0);
    const gross = Number(payment.grossAmount || 0);
    const hasManualBalance =
      options?.manualBalance !== undefined &&
      options?.manualBalance !== null &&
      Number.isFinite(Number(options.manualBalance));

    if (hasManualBalance) {
      payment.balanceAmount = Math.max(0, Number(options?.manualBalance));
    } else {
      const rawBalance = gross - advance - paid;
      // Prevent negative payable values. Overpayment is treated as fully settled.
      payment.balanceAmount = Math.max(0, rawBalance);
    }

    if (options?.manualStatus) {
      payment.status = options.manualStatus;
      return;
    }

    if (payment.balanceAmount === 0) payment.status = PaymentStatus.SETTLED;
    else if (advance > 0 || paid > 0) payment.status = PaymentStatus.PARTIAL;
    else payment.status = PaymentStatus.PENDING;
  }

  async create(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentsRepository.create(createPaymentDto);
    this.applyPaymentRules(payment, {
      manualBalance: createPaymentDto.balanceAmount,
      manualStatus: createPaymentDto.status as PaymentStatus | undefined,
    });
    return await this.paymentsRepository.save(payment);
  }

  async findAll() {
    return this.paymentsRepository.find({ relations: ['labour'], order: { periodStart: 'DESC' } });
  }

  async findOne(id: number) {
    return this.paymentsRepository.findOne({ where: { id }, relations: ['labour'] });
  }

  async update(id: number, payload: Partial<CreatePaymentDto>) {
    const existing = await this.paymentsRepository.findOneBy({ id });
    if (!existing) return null;

    const merged = this.paymentsRepository.merge(existing, payload);
    this.applyPaymentRules(merged, {
      manualBalance: payload.balanceAmount,
      manualStatus: payload.status as PaymentStatus | undefined,
    });

    await this.paymentsRepository.save(merged);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.paymentsRepository.delete(id);
  }
}
