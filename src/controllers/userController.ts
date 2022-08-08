import { User } from '../entities/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validate } from 'class-validator'
import { dataSource } from '../dataSource'
import dotenv from 'dotenv'
import { transporter } from '../config/emailConfig'

dotenv.config()

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
        user.first_name = firstName.toLowerCase()
        user.user_name = userName.toLowerCase()
        user.last_name = lastName.toLowerCase()
        user.password = hashedPassword
        user.email = email.toLowerCase()

        const errors = await validate(user)

        if (errors.length > 0) {
          return res.send(errors)
        } else {
          await User.save(user)

          const saved_user = await User.findOneBy({ email: email })
          // Generate JWT token
          const token = jwt.sign(
            { userId: saved_user!.id },
            process.env.JWT_SECRET_KEY as jwt.Secret,
            { expiresIn: '2w' }
          )
          // * front end link
          const link = `http://localhost:3000/api/user/verify/${user.id}/${token}`

          let email_verification = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Project - Email verification',
            html: `
              <h1>Email Verification</h1>
              <br>
              <a href=${link}>Click here</a> to verify your email
              <br>
              or use this link : ${link}<br>
              <P> Have a nice day! </p>`,
          }

          await transporter.sendMail(email_verification).catch(error => {
            console.log(error)
          })

          // * React route will looks like this
          // /api/user/verify/:id/:token

          res.send({
            status: 'success',
            msg: 'email send, please check your email',
            info: email_verification,
          })
        }
      } catch (error) {
        res.send({
          status: 'failed',
          msg: 'unable to register user',
        })
      }
    } else {
      return res.send({
        status: 'failed',
        msg: 'password and confirm password did not match',
      })
    }
  }

  static userLogin = async (req: any, res: any) => {
    try {
      const { email, password } = req.body

      if (email && password) {
        const user = await User.findOneBy({ email: email.toLowerCase() })
        if (user !== null) {
          const isMatch = await bcrypt.compare(password, user.password)
          if (isMatch && user.email === email) {
            if (user.email_verified === true) {
              // Generate JWT token
              const token = jwt.sign(
                { userId: user!.id },
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
                msg: 'please verify your email',
              })
            }
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
          msg: 'all field are required',
        })
      }
    } catch (error) {
      res.send({
        status: 'failed',
        msg: 'unable to login',
      })
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

  static loggedUser = async (req: any, res: any) => {
    res.send({ user: req.user })
  }

  static sendUserPasswordResetEmail = async (req: any, res: any) => {
    const { email } = req.body
    if (email) {
      const user = await User.findOneBy({ email: email })
      if (user) {
        const secret = user!.id + process.env.JWT_SECRET_KEY!
        const token = jwt.sign({ userId: user!.id }, secret, {
          expiresIn: '2h',
        })
        // * front end link
        const link = `http://localhost:3000/api/user/reset/${user.id}/${token}`

        let email = {
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: 'Project - Password reset',
          html: `
          <h1>Password Reset</h1>
          <br>
          <a href=${link}>Click here</a> to reset your password
          <br>
          or use this link : ${link}<br>
          <P> Have a nice day! </p>`,
        }

        await transporter.sendMail(email).catch(error => {
          console.log(error)
        })

        // * React route will looks like this
        // /api/user/reset/:id/:token

        res.send({
          status: 'success',
          msg: 'email send, please check your email',
          info: email,
        })
      } else {
        res.send({
          status: 'failed',
          msg: 'email does not exist',
        })
      }
    } else {
      res.send({
        status: 'failed',
        msg: 'email is required',
      })
    }
  }

  static userPasswordReset = async (req: any, res: any) => {
    const { password, passwordConfirmation } = req.body
    const { id, token } = req.params

    const user = await User.findOneBy({ id: id })
    const new_secret = user!.id + process.env.JWT_SECRET_KEY!
    try {
      jwt.verify(token, new_secret)
      if (password && passwordConfirmation && user) {
        if (password === passwordConfirmation) {
          const salt = await bcrypt.genSalt(10)
          const newHashedPassword = await bcrypt.hash(password, salt)
          await dataSource
            .createQueryBuilder()
            .update(User)
            .set({ password: newHashedPassword })
            .where('id = :id', { id: user.id })
            .execute()
          res.send({
            status: 'success',
            msg: 'password reset successfully',
          })
        } else {
          res.send({
            status: 'failed',
            msg: 'password and confirm password did not match or user does not exist',
          })
        }
      } else {
        res.send({
          status: 'failed',
          msg: 'all are required',
        })
      }
    } catch (error) {
      res.send({
        status: 'failed',
        msg: 'invalid token',
      })
    }
  }

  static userEmailVerification = async (req: any, res: any) => {
    const { id, token } = req.params

    const user = await User.findOneBy({ id: id })
    if (user !== null) {
      const new_secret = user!.id + process.env.JWT_SECRET_KEY!
      try {
        jwt.verify(token, new_secret)
        const salt = await bcrypt.genSalt(10)
        await dataSource
          .createQueryBuilder()
          .update(User)
          .set({ email_verified: true })
          .where('id = :id', { id: user.id })
          .execute()
        res.send({
          status: 'success',
          msg: 'email verified successfully',
        })
      } catch (error) {
        res.send({
          status: 'failed',
          msg: 'invalid token',
        })
      }
    }
  }

  static sendUserEmailVerification = async (req: any, res: any) => {
   
      if (req.user !== null) {
         // Generate JWT token
         const token = jwt.sign(
          { userId: req.user.id },
          process.env.JWT_SECRET_KEY as jwt.Secret,
          { expiresIn: '2w' }
        )
        // * front end link
        const link = `http://localhost:3000/api/user/verify/${req.user.id}/${token}`

        let email_verification = {
          from: process.env.EMAIL_FROM,
          to: req.user.email,
          subject: 'Project - Email verification',
          html: `
          <h1>Email Verification</h1>
          <br>
          <a href=${link}>Click here</a> to verify your email
          <br>
          or use this link : ${link}<br>
          <P> Have a nice day! </p>`,
        }

        await transporter.sendMail(email_verification).catch(error => {
          console.log(error)
        })

        // * React route will looks like this
        // /api/user/verify/:id/:token
        res.send({
          status: 'success',
          msg: 'email send, please check your email',
          info: email_verification,
        })
      } else {
        res.send({
          status: 'failed',
          msg: 'user does not exist',
        })
      }
    
  }
}
