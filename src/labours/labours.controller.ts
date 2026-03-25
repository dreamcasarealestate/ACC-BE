import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { LaboursService } from './labours.service';
import { CreateLabourDto } from './dto/create-labour.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LabourStatus } from './entities/labour.entity';

@ApiTags('labours')
@Controller('labours')
export class LaboursController {
  constructor(private readonly laboursService: LaboursService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new labour' })
  @ApiResponse({ status: 201, description: 'Labour created successfully.' })
  create(@Body() createLabourDto: CreateLabourDto) {
    return this.laboursService.create(createLabourDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all labours' })
  findAll() {
    return this.laboursService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific labour' })
  findOne(@Param('id') id: string) {
    return this.laboursService.findOne(+id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Activate or Deactivate labour' })
  updateStatus(@Param('id') id: string, @Body('status') status: LabourStatus) {
    return this.laboursService.updateStatus(+id, status);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update labour details' })
  update(@Param('id') id: string, @Body() payload: Partial<CreateLabourDto>) {
    return this.laboursService.update(+id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a labour' })
  remove(@Param('id') id: string) {
    return this.laboursService.remove(+id);
  }
}
