import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AttendanceStatus } from '../entities/attendance.entity';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  labourId: number;

  @ApiProperty({ description: 'Date string containing YYYY-MM-DD' })
  @IsString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  overtimeHours?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  markedBy?: number;
}
