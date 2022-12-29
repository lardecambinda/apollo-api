import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, ManyToOne, OneToOne, JoinColumn, OneToMany } from "typeorm"

import bcrypt from 'bcrypt'
import { Address } from "./Address"
import { Products } from "./Products"

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

    @Column({ nullable: true })
    role: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10)
    }

    @OneToOne(() => Address, { cascade: true, eager: true, nullable: false })
    @JoinColumn()
    address: Address;

    @OneToMany(() => Products, products => products, {})
    @JoinColumn()
    products: [Products];
}
