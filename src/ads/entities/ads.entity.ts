import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Importing User entity from the specified path

@Entity({ name: 'ads' }) // Defining the entity with name 'ads'
export class Ad {
  @PrimaryGeneratedColumn({ name: 'ad_id' }) // Primary generated column for adId
  adId: number;

  // Column for technical information
  @Column({ name: 'technical_info', type: 'varchar', length: 256, nullable: true })
  technicalInfo: string;

  // Column for address
  @Column({ name: 'address', type: 'varchar', length: 512, nullable: false })
  address: string;

  // Column for mobile number
  @Column({ name: 'mobile_num', type: 'varchar', length: 15, nullable: false})
  mobileNum: string;

  // Column for city
  @Column({ name: 'city', type: 'varchar', length: 128, nullable: false })
  city: string;

  // Column for car name
  @Column({ name: 'car_name', type: 'varchar', length: 128, nullable: false })
  carName: string;

  // Column for pictures URL
  @Column({ name: 'pics_url', type: 'varchar', length: 512, nullable: false })
  picsUrl: string;

  // Column for additional information
  @Column({ name: 'additional_info', type: 'text', nullable: true })
  additionalInfo: string;

  // Column for price
  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  // Column for date
  @Column({ name: 'date',  type: 'varchar', length: 512, nullable: false })
  date: string;

  // Column for year
  @Column({ name: 'year', type: 'integer', nullable: false })
  year: number;

  // Column for status
  @Column({ name: 'status', type: 'integer', default: 1 })
  status: number;

  // Column for model
  @Column({ name: 'model', type: 'varchar', length: 128, nullable: false })
  model: string;

  // Column for video URL
  @Column({ name: 'video_url', type: 'varchar', length: 512, nullable: true })
  videoUrl: string;

  // Column for brand
  @Column({ name: 'brand', type: 'varchar', length: 128, nullable: false })
  brand: string;

  // Column for color
  @Column({ name: 'color', type: 'varchar', length: 64, nullable: false })
  color: string;

  // Column for distance
  @Column({ name: 'distance', type: 'integer', default: 0 })
  distance: number;

  // Column for accidental
  @Column({ name: 'accidental', type: 'boolean', default: false })
  accidental: boolean;

  // Column for user id
  @Column({ name: 'user_id', type: 'integer', nullable: false })
  userId: number;


  /*
  @ManyToOne(() => User)
  // Joining on user_id column
  @JoinColumn({ name: 'user_id' }) 
  user: User;
*/
}
