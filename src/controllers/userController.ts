import { User } from '../entities/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import express from 'express'
import { validate } from 'class-validator'

const router = express.Router()

router.post('/api/register', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    userName,
    password,
    passwordConfirmation,
  } = req.body

  if (password === passwordConfirmation) {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const user = new User()
      user.first_name = firstName
      user.user_name = userName
      user.last_name = lastName
      user.password = hashedPassword
      user.email = email

      const errors = await validate(user)

      if (errors.length > 0) {
        return res.send(errors)
      } else {
        await User.save(user)
        return res.json(user)
      }
    } catch (error) {
      res.send({
        status: 'failed',
        msg: '🔴 Unable to register 📑',
      })
      console.log(error)
      throw new Error('🔴 Something went wrong 🤔')
    }
  } else {
    return res.send({
      status: 'failed',
      msg: 'Password did not match',
    })
  }
})

export { router as createUserRouter }
