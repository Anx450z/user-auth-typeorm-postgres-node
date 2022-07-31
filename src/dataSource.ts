import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { User } from './entities/Users'

dotenv.config()

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.HOST,
  port: parseInt(process.env.PORT!) as number,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  // * Add additional entities below
  entities: [User],
  // * Automatic Migration below
  synchronize: true,
})