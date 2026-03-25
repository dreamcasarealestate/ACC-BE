import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { WorkType, WageType, LabourStatus } from '../entities/labour.entity';

export class CreateLabourDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  alternatePhone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ enum: WorkType })
  @IsEnum(WorkType)
  workType: WorkType;

  @ApiProperty({ enum: WageType })
  @IsEnum(WageType)
  wageType: WageType;

  @ApiProperty()
  @IsNumber()
  wageAmount: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  joiningDate?: Date;

  @ApiPropertyOptional({ enum: LabourStatus, default: LabourStatus.ACTIVE })
  @IsEnum(LabourStatus)
  @IsOptional()
  status?: LabourStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
