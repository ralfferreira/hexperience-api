import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import Host from '../../../../users/infra/typeorm/entities/Host';
import Schedule from './Schedule'
import Review from '../../../../reviews/infra/typeorm/entities/Review';

@Entity('Experience')
class Experience {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  duration: number;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column()
  requirements: string;

  @Column()
  parental_rating: number;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'float', precision: 8, scale: 5, nullable: true })
  latitude: number;

  @Column({ type: 'float', precision: 8, scale: 5, nullable: true })
  longitude: number;

  @Column({ type: 'boolean' })
  is_online: boolean;

  @Column({ type: 'boolean' })
  is_blocked: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Host)
  @JoinColumn({ name: 'host_id' })
  host: Host;

  @OneToMany(() => Schedule, schedule => schedule.experience)
  schedules: Schedule[];

  @OneToMany(() => Review, review => review.experience)
  reviews: Review[];
}

export default Experience;
