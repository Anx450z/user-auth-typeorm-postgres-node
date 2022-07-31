import express from 'express'
import { dataSource } from './dataSource'
import cors from 'cors'
import { createUserRouter } from './routes/userRoute'

const app = express()
// * CORS Policy
app.use(cors())

// * JSON : req.body
app.use(express.json())

const main = async () => {
  try {
    await dataSource.initialize()
    console.log('🟢 Connected successfully to Postgresql 🐘')

    // * Load Routes
    app.use("/api/user",createUserRouter)

    app.listen(8080, () => {
      console.log('🟢 Server running at Port: 8080 🌐')
    })
  } catch (error) {
    console.log(error)
    throw new Error('🔴 Unable to connect to Postgresql 🤔')
  }
}

main()