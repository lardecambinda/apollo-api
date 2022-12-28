import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm"
import { User } from "./User"

@Entity()
export class Address {

  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ nullable: false })
  cpe: string

  @Column({ nullable: false })
  street: string

  @Column({ nullable: false })
  complement: string

  @Column({ nullable: false })
  number: number

  @ManyToOne(() => User, user => user.id) user: User

}