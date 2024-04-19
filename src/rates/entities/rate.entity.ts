import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Ad } from '../../ads/entities/ads.entity'; // Importing Ad entity
import { User } from '../../users/entities/user.entity'; // Importing User entity

@Entity({ name: 'rates' }) // Define the entity name
export class Rate {
  @PrimaryGeneratedColumn({ name: 'rate_id' }) // Define primary key with auto-increment
  rateId: number;

  @Column({ name: 'score', type: 'integer', nullable: false }) // Define column for score, not nullable
  score: number;

  @ManyToOne(() => User, { eager: true }) // Define many-to-one relationship with User entity
  @JoinColumn({ name: 'user_id' }) // Join on user_id column
  user: User;

  @ManyToOne(() => Ad, { eager: true }) // Define many-to-one relationship with Ad entity
  @JoinColumn({ name: 'ad_id' }) // Join on ad_id column
  ad: Ad;
}