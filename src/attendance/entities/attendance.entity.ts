import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { Labour } from '../../labours/entities/labour.entity';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  HALF_DAY = 'HALF_DAY',
  OVERTIME = 'OVERTIME',
  LEAVE = 'LEAVE',
}

@Entity()
@Unique(['labourId', 'date'])
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  labourId: number;

  @ManyToOne(() => Labour)
  @JoinColumn({ name: 'labourId' })
  labour: Labour;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar', default: AttendanceStatus.PRESENT })
  status: AttendanceStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  overtimeHours: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ nullable: true })
  markedBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
