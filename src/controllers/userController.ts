import { User } from '../entities/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import express from 'express'

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
    const user = User.create({
      user_name: userName,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    })

    await user.save()
    console.log("saved")

    return res.json(user)
  } else {
    return res.send({
      status: 'failed',
      msg: 'Password did not match',
    })
  }
})

export { router as createUserRouter }
