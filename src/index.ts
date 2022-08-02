import express from 'express'
import { dataSource } from './dataSource'
import cors from 'cors'
import { createUserRouter } from './routes/userRoute'
import dotenv from 'dotenv'
import { initialize } from '../src/config/passportConfig'
import session from 'express-session'
import passport from 'passport'

dotenv.config()
const app = express()
// * CORS Policy
app.use(cors())

// * JSON : req.body
app.use(express.json())

initialize(passport)

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.initialize())
app.use(passport.session())

const main = async () => {
  try {
    await dataSource.initialize()
    console.log('🟢 Connected successfully to Postgresql 🐘')

    // * Load Routes
    app.use('/api/user', createUserRouter)

    app.listen(process.env.SERVER, () => {
      console.log('🟢 Server running at configured port 🌐')
    })
  } catch (error) {
    console.log(error)
    throw new Error('🔴 Unable to connect to Postgresql 🤔')
  }
}

main()
