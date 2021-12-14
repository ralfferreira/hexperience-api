import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { Expose } from "class-transformer";

import storageConfig from '@config/storage';

import Experience from "./Experience";

@Entity('ExpPhoto')
class ExpPhoto {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  photo: string;

  @Expose({ name: 'photo_url' })
  getPhotoUrl(): string | null {
    if (!this.photo) {
      return null;
    }

    switch (global.env.STORAGE_DRIVER) {
      case 'disk':
        return `${global.env.APP_API_URL}/files/${this.photo}`
      case 's3':
        return `https://${storageConfig.config.s3.bucket}.s3.amazonaws.com/${this.photo}`;
      default:
        return null;
    }
  }

  @ManyToOne(() => Experience, exp => exp.schedules)
  @JoinColumn({ name: 'exp_id' })
  experience: Experience;
}

export default ExpPhoto;
