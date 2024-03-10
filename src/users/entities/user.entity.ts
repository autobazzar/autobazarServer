import { hash } from "bcrypt";
import { SALT_ROUNDS } from "config";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, SALT_ROUNDS);
    }

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ type: 'varchar', length: 256 })
    password: string;

    @Column({ type: 'varchar', length: 64 })
    userName: string;

    @Column({ type: 'varchar', length: 128, unique: true })
    email: string;

}
