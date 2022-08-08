import express from 'express'
import { checkUserAuth } from '../middleware/auth-middleware'
import { UserController } from '../controllers/userController'

const router = express.Router()
// Route level Middleware - To Protect Route
router.use('/change-password', checkUserAuth)
router.use('/logged-user', checkUserAuth)
router.use('/user-email-verify', checkUserAuth)

// Public Route
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)
router.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail)
router.post('/user-password-reset/:id/:token', UserController.userPasswordReset)
router.post('/user-email-verify/:id/:token', UserController.userEmailVerification)

// Protected Route
router.post('/change-password', UserController.changeUserPassword)
router.get('/logged-user', UserController.loggedUser)
router.get('/user-email-verify', UserController.sendUserEmailVerification)

export { router as createUserRouter }