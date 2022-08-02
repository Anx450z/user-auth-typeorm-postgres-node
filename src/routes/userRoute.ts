import express from 'express'
import { checkUserAuth } from '../middleware/auth-middleware'
import { UserController } from '../controllers/userController'
import passport from 'passport'

const router = express.Router()
// Route level Middleware - To Protect Route
router.use('/change-password', checkUserAuth)
router.use('/logged-user', checkUserAuth)

// Public Route
router.post('/register', UserController.userRegistration)
// router.post('/login', UserController.userLogin)
router.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail)
router.post('/user-password-reset/:id/:token', UserController.userPasswordReset)
// ! Passport router
router.post('/login', passport.authenticate('local'), UserController.passportLogin)

// Protected Route
router.post('/change-password', UserController.changeUserPassword)
router.get('/logged-user', UserController.loggedUser)

export { router as createUserRouter }
