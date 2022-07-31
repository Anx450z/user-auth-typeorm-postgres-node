import { PrimaryGeneratedColumn, Column, Entity, BaseEntity } from 'typeorm'
import { Length, IsEmail } from 'class-validator'

@Entity('user_auth')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
  })
  @Length(6, 15)
  user_name: string

  @Column({})
  @Length(6, 20)
  first_name: string

  @Column({})
  @Length(6, 20)
  last_name: string

  @Column({})
  @IsEmail()
  email: string

  @Column()
  @Length(8, 20)
  password: string
}