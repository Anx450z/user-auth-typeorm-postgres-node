import passport from 'passport'
import passportLocal from 'passport-local'
import { User } from '../entities/User'

const LocalStrategy = passportLocal.Strategy

function initialize(passport: any) {
  passport.initialize()
  passport.session()

  passport.use(
    new LocalStrategy(async (email: string, password: string, done) => {
      const user = await User.findOneBy({email: email})
      
    })
  )

  passport.serializeUser((user: any, cb: any) => {
    cb(null, user.id)
  })

  passport.deserializeUser(async (id: number, cb: any) => {
    try {
      const user = await User.findOneBy({ id: id })
      if (user != null) {
        const userInformation = {
          email: user.email,
          userId: user.id,
          isAdmin: user?.is_admin,
        }
        cb(userInformation)
      }
    } catch (error) {
      cb(error)
    }
  })
}

export { initialize as initializePassportConfig }
