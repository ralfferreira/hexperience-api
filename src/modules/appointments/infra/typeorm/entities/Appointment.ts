import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";

import Schedule from "../../../../experiences/infra/typeorm/entities/Schedule";
import User from "../../../../users/infra/typeorm/entities/User";

@Entity('Appointment')
class Appointment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  guests: number;

  @Column({ type: 'boolean' })
  paid: boolean;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  final_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Schedule)
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;
}

export default Appointment;
