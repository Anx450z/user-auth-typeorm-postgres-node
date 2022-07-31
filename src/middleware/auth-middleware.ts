import jwt from 'jsonwebtoken'
import { User } from '../entities/User'

export var checkUserAuth = async (req: any, res: any, next: any) => {
  let token
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Getting token from header
      token = authorization.split(' ')[1]

      // Verify Token
      const { userID } = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as jwt.Secret
      ) as any

      // get user from token
      req.user = await User.findOneBy({ id: userID })
      next()
    } catch (error) {
      res.send({
        status: 'failed',
        msg: 'unauthorized user',
      })
    }
  }
  if (!token) {
    res.send({
      status: 'failed',
      msg: 'no token found',
    })
  }
}
