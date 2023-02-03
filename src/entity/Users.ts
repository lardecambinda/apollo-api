import { Posts } from './Posts';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm"

import bcrypt from 'bcrypt'

@Entity()
export class Users {

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

    @Column('text', { array: true, nullable: true })
    @OneToMany(() => Posts, (post) => post.user, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        eager: true,
    })
    posts: Array<Posts>

    @BeforeInsert()
    @BeforeUpdate()
    async hashPasswd() {
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
    }

}
