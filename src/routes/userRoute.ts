import express from 'express'
import { checkUserAuth } from '../middleware/auth-middleware'
import { UserController } from '../controllers/userController'

const router = express.Router()
// Route level Middleware - To Protect Route
router.use('/changepassword', checkUserAuth)
router.use('/:userName', checkUserAuth)

// Public Route
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)

// Protected Route
router.post('/changepassword', UserController.changeUserPassword)
router.get('/:userName', UserController.loggedUser)

export { router as createUserRouter }
