import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { Labour } from '../labours/entities/labour.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Labour)
    private laboursRepository: Repository<Labour>,
  ) {}

  private async resolveLabours(labourIds?: number[]) {
    const ids = (labourIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0);
    if (!ids.length) return [];
    return this.laboursRepository.findBy({ id: In(ids) });
  }

  async create(payload: CreateProjectDto) {
    const labours = await this.resolveLabours(payload.labourIds);
    const project = this.projectsRepository.create({
      ...payload,
      labours,
    });
    await this.projectsRepository.save(project);
    return this.findOne(project.id);
  }

  async findAll() {
    return this.projectsRepository.find({ relations: ['labours'], order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    return this.projectsRepository.findOne({ where: { id }, relations: ['labours'] });
  }

  async findLabours(id: number) {
    const project = await this.projectsRepository.findOne({ where: { id }, relations: ['labours'] });
    return project?.labours || [];
  }

  async update(id: number, payload: Partial<CreateProjectDto>) {
    const existing = await this.projectsRepository.findOne({ where: { id }, relations: ['labours'] });
    if (!existing) return null;

    if (payload.labourIds) {
      existing.labours = await this.resolveLabours(payload.labourIds);
    }

    existing.projectName = payload.projectName ?? existing.projectName;
    existing.town = payload.town ?? existing.town;
    existing.ownerName = payload.ownerName ?? existing.ownerName;
    existing.ownerContact = payload.ownerContact ?? existing.ownerContact;
    existing.siteAddress = payload.siteAddress ?? existing.siteAddress;
    existing.description = payload.description ?? existing.description;

    await this.projectsRepository.save(existing);
    return this.findOne(id);
  }

  async updateLabours(id: number, labourIds: number[]) {
    const existing = await this.projectsRepository.findOne({ where: { id }, relations: ['labours'] });
    if (!existing) return null;
    existing.labours = await this.resolveLabours(labourIds);
    await this.projectsRepository.save(existing);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.projectsRepository.delete(id);
  }
}
