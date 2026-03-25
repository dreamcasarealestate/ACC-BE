import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Labour } from '../../labours/entities/labour.entity';

export enum PaymentType {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  SETTLED = 'SETTLED',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  labourId: number;

  @ManyToOne(() => Labour)
  @JoinColumn({ name: 'labourId' })
  labour: Labour;

  @Column({ type: 'varchar', default: PaymentType.WEEKLY })
  paymentType: PaymentType;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;

  @Column({ type: 'int', default: 0 })
  totalDaysPresent: number;

  @Column({ type: 'int', default: 0 })
  totalHalfDays: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  overtimeAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  grossAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  advanceAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balanceAmount: number;

  @Column({ type: 'varchar', default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ nullable: true })
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
