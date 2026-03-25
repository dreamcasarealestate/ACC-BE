import { Controller, Get, Post, Body, Param, Delete, Patch, Req } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@ApiTags('attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly jwtService: JwtService,
  ) {}

  private extractUserIdFromAuthHeader(req: any): number | undefined {
    const authHeader = req?.headers?.authorization as string | undefined;
    if (!authHeader?.startsWith('Bearer ')) return undefined;
    const token = authHeader.replace('Bearer ', '').trim();
    const decoded = this.jwtService.decode(token) as { sub?: number } | null;
    if (!decoded?.sub) return undefined;
    return Number(decoded.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Mark daily attendance' })
  @ApiResponse({ status: 201, description: 'Attendance marked successfully.' })
  @ApiResponse({ status: 409, description: 'Conflict: Attendance already exists.' })
  markAttendance(@Body() createAttendanceDto: CreateAttendanceDto, @Req() req: any) {
    const userId = this.extractUserIdFromAuthHeader(req);
    if (userId && !createAttendanceDto.markedBy) {
      createAttendanceDto.markedBy = userId;
    }
    return this.attendanceService.markAttendance(createAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance records' })
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get('labour/:labourId')
  @ApiOperation({ summary: 'Get attendance for a specific labour' })
  findByLabour(@Param('labourId') labourId: string) {
    return this.attendanceService.findByLabour(+labourId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update attendance record' })
  update(@Param('id') id: string, @Body() payload: Partial<CreateAttendanceDto>, @Req() req: any) {
    const userId = this.extractUserIdFromAuthHeader(req);
    if (userId && !payload.markedBy) {
      payload.markedBy = userId;
    }
    return this.attendanceService.update(+id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attendance record' })
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(+id);
  }
}
