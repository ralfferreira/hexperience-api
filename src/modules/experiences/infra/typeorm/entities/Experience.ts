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

import storageConfig from '@config/storage';

import Host from '../../../../users/infra/typeorm/entities/Host';
import Review from '../../../../reviews/infra/typeorm/entities/Review';
import Report from '../../../../reviews/infra/typeorm/entities/Report';
import Schedule from './Schedule'
import Category from './Category';
import ExpPhoto from './ExpPhoto';
import Favorite from './Favorite';

@Entity('Experience')
class Experience {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  cover: string;

  @Expose({ name: 'cover_url' })
  getCoverUrl(): string | null {
    if (!this.cover) {
      return null;
    }

    switch (global.env.driver) {
      case 'disk':
        return `${global.env.APP_API_URL}/files/${this.cover}`
      case 's3':
        return `https://${storageConfig.config.s3.bucket}.s3.amazonaws.com/${this.cover}`;
      default:
        return null;
    }
  }

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

  @Column({ type: 'boolean' })
  hidden: boolean;

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

  @OneToMany(() => Report, report => report.experience)
  reports: Report[];

  @OneToMany(() => ExpPhoto, photo => photo.experience)
  photos: ExpPhoto[];

  @OneToMany(() => Favorite, favorite => favorite.experience)
  favorites: Favorite[];

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category

  @Expose({ name: 'rating' })
  getRating(): number {
    let score = 0;
    let rating = 0;

    if (!this.reviews) {
      return rating;
    }

    if (this.reviews.length) {
      let nReviews = 0;

      for (const review of this.reviews) {
        nReviews++;
        score += review.rating;
      }

      rating = score / nReviews;
    }

    return rating;
  }
}

export default Experience;
