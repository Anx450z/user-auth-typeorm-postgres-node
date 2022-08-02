import express from 'express'
import { checkUserAuth } from '../middleware/auth-middleware'
import { UserController } from '../controllers/userController'

const router = express.Router()
// Route level Middleware - To Protect Route
router.use('/change-password', checkUserAuth)
router.use('/logged-user', checkUserAuth)
router.use('/logout', checkUserAuth)

// Public Route
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)
router.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail)
router.post('/user-password-reset/:id/:token', UserController.userPasswordReset)

// Protected Route
router.post('/change-password', UserController.changeUserPassword)
router.get('/logged-user', UserController.loggedUser)
router.delete('/logout', UserController.logoutUser)

export { router as createUserRouter }
