import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';

import Experience from './Experience';
import Appointment from '../../../../appointments/infra/typeorm/entities/Appointment';

@Entity('Schedule')
class Schedule {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  max_guests: number;

  @Column()
  availability: number;

  @ManyToOne(() => Experience, exp => exp.schedules)
  @JoinColumn({ name: 'exp_id' })
  experience: Experience;
}

export default Schedule;
