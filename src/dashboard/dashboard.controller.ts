import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get dashboard summary metrics' })
  @ApiQuery({ name: 'date', required: false, description: 'YYYY-MM-DD format. Defaults to today.' })
  getSummary(@Query('date') date?: string) {
    return this.dashboardService.getSummary(date);
  }
}
