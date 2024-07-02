import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity({ name: 'Comment' }) // Define the entity name
export class Comment {
  @PrimaryGeneratedColumn({ name: 'comment_id' }) // Define primary key with auto-increment
  rateId: number;

  @Column({ name: 'comment', type: 'varchar', length: 512, nullable: false }) // Define column for score, not nullable
  comment: string;

  @Column({ name: 'user_id', type: 'integer', nullable: false }) // Define column for score, not nullable
  userId: number;

  @Column({ name: 'ad_id', type: 'integer', nullable: false }) // Define column for score, not nullable
  adId: number;
}
