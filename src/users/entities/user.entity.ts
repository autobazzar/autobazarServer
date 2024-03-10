import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ type: 'varchar', length: 256 })
    password: string;

    @Column({ type: 'varchar', length: 64 })
    userName: string;
}
