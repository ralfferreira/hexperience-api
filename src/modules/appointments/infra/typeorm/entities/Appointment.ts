import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn
} from "typeorm";

import Schedule from "../../../../experiences/infra/typeorm/entities/Schedule";
import User from "../../../../users/infra/typeorm/entities/User";

export enum statusEnum {
  unpaid = 'unpaid',
  paid = 'paid',
  refund = 'refund'
}

@Entity('Appointment')
class Appointment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  guests: number;

  @Column({
    type: 'enum',
    enum: statusEnum,
    default: statusEnum.unpaid
  })
  status: statusEnum;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  final_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Schedule, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;
}

export default Appointment;
