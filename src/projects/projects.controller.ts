import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create project and optionally onboard labours' })
  create(@Body() payload: CreateProjectDto) {
    return this.projectsService.create(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by id' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Get(':id/labours')
  @ApiOperation({ summary: 'Get all onboarded labours for a project' })
  findLabours(@Param('id') id: string) {
    return this.projectsService.findLabours(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project details and onboarded labours' })
  update(@Param('id') id: string, @Body() payload: Partial<CreateProjectDto>) {
    return this.projectsService.update(+id, payload);
  }

  @Patch(':id/labours')
  @ApiOperation({ summary: 'Update only onboarded labour list for a project' })
  updateLabours(@Param('id') id: string, @Body('labourIds') labourIds: number[]) {
    return this.projectsService.updateLabours(+id, labourIds || []);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
