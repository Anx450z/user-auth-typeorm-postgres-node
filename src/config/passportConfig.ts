import passportLocal from 'passport-local'
import { User } from '../entities/User'
import bcrypt from 'bcrypt'

const LocalStrategy = passportLocal.Strategy

export function initialize(passport: any) {

  passport.use(
    new LocalStrategy(async (email: string, password: string, done) => {
      try {
        const user = await User.findOneBy({ email: email })

        if (!user) return done(null, false)
        bcrypt.compare(password, user.password, (err, result: boolean) => {
          if (err) throw err
          if (result === true) {
            return done(null, user)
          } else {
            return done(null, false)
          }
        })
      } catch (error) {
        console.log(error)
        throw error
      }
    })
  )

  passport.serializeUser((user: any, cb: any) => {
    cb(null, user.id)
  })

  passport.deserializeUser(async (id: number, cb: any) => {
    let userInformation, err
    try {
      const user = await User.findOneBy({ id: id })
      if (user != null) {
        userInformation = {
          email: user.email,
          userId: user.id,
          isAdmin: user?.is_admin,
        }
      }
    } catch (error) {
      err = error
    }
    cb(err, userInformation)
  })
}
