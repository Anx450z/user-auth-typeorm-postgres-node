import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Length, IsEmail } from 'class-validator'

@Entity('user_auth')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
  })
  @Length(3, 15)
  user_name: string

  @Column({})
  @Length(3, 20)
  first_name: string

  @Column({})
  @Length(3, 20)
  last_name: string

  @Column({
    unique: true
  })
  @IsEmail()
  email: string

  @Column()
  password: string

  @CreateDateColumn()
  created_on: Date

  @UpdateDateColumn()
  updated_on: Date
}