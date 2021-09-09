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
import { Expose } from 'class-transformer';

import Host from '../../../../users/infra/typeorm/entities/Host';
import Schedule from './Schedule'
import Review from '../../../../reviews/infra/typeorm/entities/Review';
import Category from './Category';

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

  @Column()
  max_guests: number;

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

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category

  @Expose({ name: 'rating' })
  getRating(): number {
    let score = 0;
    let rating = 0;

    if (this.reviews.length) {
      let nReviews = 0;

      for (const review of this.reviews) {
        if (!review.is_complaint) {
          nReviews++;
          score += review.rating;
        }
      }

      rating = score / nReviews;
    }

    return rating;
  }
}

export default Experience;
