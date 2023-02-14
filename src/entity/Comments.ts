import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { Users } from "./Users"
import { Posts as Post } from "./Posts"

@Entity()
export class Comments {

  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  comment: string

  @Column({ type: 'varchar', nullable: true })
  @ManyToOne(() => Post, (post) => post.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  post: Post

  @Column({ nullable: true })
  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  user: string

}
