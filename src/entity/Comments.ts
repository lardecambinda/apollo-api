import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, OneToMany } from "typeorm"
import { Users } from "./Users"
import { Posts as Post } from "./Posts"

@Entity()
export class Comments {

  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  comment: string

  @Column('text', { array: true, nullable: true })
  @OneToMany(() => Post, (post) => post.id, {
    eager: true
  })
  post: Array<Post>

  @Column({ nullable: true })
  @ManyToOne(() => Users, (user) => user.id)
  @JoinTable()
  user: string

}
