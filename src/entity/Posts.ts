import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, OneToMany } from "typeorm"
import { Users } from "./Users"
import { Comments } from "./Comments"

@Entity()
export class Posts {

  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ nullable: false })
  title: string

  @Column({ nullable: false })
  content: string

  @Column({ nullable: true })
  @OneToMany(() => Comments, (comment) => comment.id)
  comments: Comments

  @Column({ nullable: true })
  @ManyToOne(() => Users, (user) => user.id)
  user: string

  @Column('text', { array: true })
  files?: Array<string>

}
