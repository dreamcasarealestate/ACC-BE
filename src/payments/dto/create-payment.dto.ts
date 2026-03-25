import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentType, PaymentStatus } from '../entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  labourId: number;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  periodStart: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  periodEnd: Date;

  @ApiProperty({ default: 0 })
  @IsNumber()
  totalDaysPresent: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  totalHalfDays: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  overtimeAmount: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  grossAmount: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  advanceAmount?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  paidAmount?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @IsOptional()
  balanceAmount?: number;

  @ApiPropertyOptional({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
