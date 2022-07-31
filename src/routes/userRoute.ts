import express from 'express'
import { UserController } from '../controllers/userController'

const router = express.Router()

// Public Route
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)

// Protected Route

export { router as createUserRouter }
