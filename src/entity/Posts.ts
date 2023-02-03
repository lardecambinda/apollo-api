import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable } from "typeorm"
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

  @Column('text', { array: true, nullable: true })
  @ManyToOne(() => Comments, (comment) => comment.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true
  })
  @JoinTable()
  comments: Array<Comments>

  @Column({ nullable: true })
  @ManyToOne(() => Users, (user) => user.id)
  @JoinTable()
  user: string

  @Column('text', { array: true })
  files?: Array<string>

}
