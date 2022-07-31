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
    const user = new User()
    user.first_name = firstName
    user.user_name = userName
    user.last_name = lastName
    user.password = password
    user.email = email

    const errors = await validate(user)

    if (errors.length > 0) {
      console.log(errors)
      return res.send(errors)
    } else {
      await User.save(user)
      return res.json(user)
    }
  } else {
    return res.send({
      status: 'failed',
      msg: 'Password did not match',
    })
  }
})

export { router as createUserRouter }
