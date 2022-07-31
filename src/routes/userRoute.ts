import express from 'express'
import { checkUserAuth } from '../middleware/auth-middleware'
import { UserController } from '../controllers/userController'

const router = express.Router()
// Route level Middleware - To Protect Route
router.use('/changepassword', checkUserAuth)

// Public Route
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)

// Protected Route
router.post('/changepassword', UserController.changeUserPassword)

export { router as createUserRouter }
