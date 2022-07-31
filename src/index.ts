import express from 'express'
import { dataSource } from './dataSource'

const app = express()

const main = async () => {
  try {
    await dataSource.initialize()
    console.log('🟢 Connected successfully to Postgresql 🐘')

    // TODO: Add Middleware

    app.listen(8080, () => {
      console.log('🟢 Server running at Port: 8080 🌐')
    })
  } catch (error) {
    console.log(error)
    throw new Error('🔴 Unable to connect to Postgresql 🤔')
  }
}

main()