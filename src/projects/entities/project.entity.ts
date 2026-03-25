import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Labour } from '../../labours/entities/labour.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectName: string;

  @Column()
  town: string;

  @Column()
  ownerName: string;

  @Column()
  ownerContact: string;

  @Column({ type: 'text' })
  siteAddress: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Labour, (labour) => labour.projects)
  @JoinTable({
    name: 'project_labours',
    joinColumn: { name: 'projectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'labourId', referencedColumnName: 'id' },
  })
  labours: Labour[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
