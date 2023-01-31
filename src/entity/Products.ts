import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, JoinTable, ManyToOne, OneToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Products {

  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  price: number

  @Column()
  size: string

  @Column('text', { array: true })
  colors: string[]

  @Column()
  mainImage: string

  @Column('text', { array: true })
  images: string[]

} 