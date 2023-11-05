import express from 'express'
import { expressjwt } from 'express-jwt'

import environ from '../environ'

import userController from '../controllers/user'
// import authMiddleware from '../middlewares/auth'

const router = express.Router()

router.post('/signup', userController.signup)
router.get('/users', userController.getUsers)
router.get('/users/:id', userController.getById)
router.post('/login', userController.login)
router.post('/refresh', userController.refresh)
router.delete(
  '/users/:id',
  expressjwt({
    secret: environ.JWT_SECRET,
    issuer: environ.ISS,
    algorithms: ['HS256'],
  }),
  userController.deleteUser
)

export default router
