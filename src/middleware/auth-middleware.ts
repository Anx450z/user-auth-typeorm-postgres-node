import jwt from 'jsonwebtoken'
import { dataSource } from '../dataSource'
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
      req.user = await dataSource
        .createQueryBuilder(User, 'user')
        .select('user.id')
        .addSelect('user.email')
        .addSelect('user.first_name')
        .addSelect('user.created_on')
        .addSelect('user.is_admin')
        .where('id = :id', { id: userID })
        .getOne()

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
