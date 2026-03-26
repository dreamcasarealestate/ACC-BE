import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

export enum WorkType {
  MASON = 'Mason',
  HELPER = 'Helper',
  CARPENTER = 'Carpenter',
  ELECTRICIAN = 'Electrician',
  PLUMBER = 'Plumber',
  PAINTER = 'Painter',
  PLASTERING = 'Plastering',
  CONCRETE_WORK = 'Concrete Work',
  SHUTTERING = 'Shuttering',
  BRICK_MASON = 'Brick Mason',
  STEEL_WORKER = 'Steel worker',
  TILE_WORKER = 'Tile worker',
  OTHER = 'Other',
}

export enum WageType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum LabourStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity()
export class Labour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  alternatePhone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', default: WorkType.OTHER })
  workType: WorkType;

  @Column({ type: 'varchar', default: WageType.DAILY })
  wageType: WageType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  wageAmount: number;

  @Column({ type: 'date', nullable: true })
  joiningDate: Date;

  @Column({ type: 'varchar', default: LabourStatus.ACTIVE })
  status: LabourStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  createdBy: number;

  @ManyToMany(() => Project, (project) => project.labours)
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
