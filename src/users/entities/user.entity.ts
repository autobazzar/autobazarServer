import { hash } from "bcrypt";
import { SALT_ROUNDS } from "config";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @BeforeInsert()
    async hashPassword() {
        if (this.password)
            this.password = await hash(this.password, SALT_ROUNDS);
    }

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ type: 'varchar', length: 256, nullable: true })
    password: string;

    @Column({ type: 'varchar', length: 64 })
    userName: string;

    @Column({ type: 'varchar', length: 128, unique: true })
    email: string;

    @Column({ name: 'role', type: 'varchar', length: 256, nullable: true })
    role: string;

    @Column({ name: 'isBanned', type: 'boolean', default: false })
    isBanned: boolean;

    @Column({ name: 'phone', type: 'varchar', length: 256, nullable: true })
    phone: string;

    @Column({ name: 'address', type: 'varchar', length: 256, nullable: true })
    address: string;

    @Column({ name: 'name', type: 'varchar', length: 256, nullable: true })
    name: string;


}
