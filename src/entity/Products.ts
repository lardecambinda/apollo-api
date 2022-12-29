import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, JoinTable, ManyToOne } from "typeorm";
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

  @ManyToOne(() => User, product => product, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User
}