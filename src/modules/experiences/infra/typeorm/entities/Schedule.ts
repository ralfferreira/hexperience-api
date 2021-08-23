import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Experience from './Experience';

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
  experience: Experience
}

export default Schedule;
