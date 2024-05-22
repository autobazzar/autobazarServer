import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Ad } from '../../ads/entities/ads.entity'; // Importing Ad entity
import { User } from '../../users/entities/user.entity'; // Importing User entity

@Entity({ name: 'rates' }) // Define the entity name
export class Rate {
  @PrimaryGeneratedColumn({ name: 'rate_id' }) // Define primary key with auto-increment
  rateId: number;

  @Column({ name: 'score', type: 'integer', nullable: false }) // Define column for score, not nullable
  score: number;

  @Column({ name: 'user_id', type: 'integer', nullable: false }) // Define column for score, not nullable
  userId: number;

  @Column({ name: 'ad_id', type: 'integer', nullable: false }) // Define column for score, not nullable
  adId: number;
}