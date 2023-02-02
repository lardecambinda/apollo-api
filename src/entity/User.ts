import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm"

import bcrypt from 'bcrypt'

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

    @Column({ nullable: true })
    role: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPasswd() {
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
    }

}
