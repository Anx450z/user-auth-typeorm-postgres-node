import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'
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

  @Index()
  @Column({
    unique: true
  })
  @IsEmail()
  email: string

  @Column({
    // select: false
  })
  password: string

  @CreateDateColumn()
  created_on: Date

  @UpdateDateColumn()
  updated_on: Date

  @Column({
    default: false
  })
  is_validated: boolean

  @Column({
    default: false
  })
  is_admin: boolean
}