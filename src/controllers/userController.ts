import { User } from '../entities/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validate } from 'class-validator'
import { dataSource } from '../dataSource'

export class UserController {
  static userRegistration = async (req: any, res: any) => {
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

          const saved_user = await User.findOneBy({ email: email })
          // Generate JWT token
          const token = jwt.sign(
            { userID: saved_user!.id },
            process.env.JWT_SECRET_KEY as jwt.Secret,
            { expiresIn: '5d' }
          )

          return res.status(201).send({
            status: 'success',
            msg: 'registration successful',
            token: token,
          })
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
  }

  static userLogin = async (req: any, res: any) => {
    try {
      const { email, password } = req.body

      if (email && password) {
        const user = await User.findOneBy({ email: email })
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password)
          if (isMatch && user.email == email) {
            // Generate JWT token
            const token = jwt.sign(
              { userID: user!.id },
              process.env.JWT_SECRET_KEY as jwt.Secret,
              { expiresIn: '5d' }
            )
            res.send({
              status: 'success',
              msg: 'login success',
              token: token,
            })
          } else {
            res.send({
              status: 'failed',
              msg: 'email or password did not match',
            })
          }
        } else {
          res.send({
            status: 'failed',
            msg: 'no user registered using this email',
          })
        }
      } else {
        res.send({
          status: 'failed',
          msg: 'field must not be empty',
        })
      }
    } catch (error) {
      res.send({
        status: 'failed',
        msg: 'unable to login',
      })
      console.log(error)
      throw new Error('🔴 Something went wrong during login 🤔')
    }
  }

  static changeUserPassword = async (req: any, res: any) => {
    const { password, passwordConfirmation } = req.body
    if (password && passwordConfirmation) {
      if (password === passwordConfirmation) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        await dataSource
          .createQueryBuilder()
          .update(User)
          .set({ password: hashedPassword })
          .where('id = :id', { id: req.user.id })
          .execute()

        res.send({
          status: 'success',
          msg: 'password changed successfully',
        })
      } else {
        res.send({
          status: 'failed',
          msg: 'password are not same',
        })
      }
    } else {
      res.send({
        status: 'failed',
        msg: 'field must not be empty',
      })
    }
  }
}
