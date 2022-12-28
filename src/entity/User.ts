import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, ManyToOne, OneToOne, JoinColumn } from "typeorm"

import bcrypt from 'bcrypt'
import { Address } from "./Address"

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ nullable: false, unique: true })
    email: string

    @Column({ nullable: false, select: false })
    password: string

    @Column({ nullable: false })
    firstName: string

    @Column({ nullable: false })
    lastName: string

    @Column({ nullable: false })
    birthDate: string

    @Column({ nullable: false, unique: true })
    cpf: string

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10)
    }

    @OneToOne(() => Address, { cascade: true, eager: true })
    @JoinColumn()
    address: Address;
}
