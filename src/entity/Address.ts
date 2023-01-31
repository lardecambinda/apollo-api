import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm"
import { User } from "./User"

@Entity()
export class Address {

  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ nullable: false })
  zipCode: number

  @Column({ nullable: false })
  street: string

  @Column({ nullable: false })
  complement: string

  @Column({ nullable: false })
  number: number
}