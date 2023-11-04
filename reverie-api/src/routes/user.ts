import express from 'express'

import userController from '../controllers/user'
import authMiddleware from '../middlewares/auth'

const router = express.Router()

router.post('/signup', userController.signup)
router.get('/users', userController.getUsers)
router.get('/users/:id', userController.getById)
router.post('/login', userController.login)
router.post('/refresh', userController.refresh)
router.delete(
  '/users/:id',
  authMiddleware.tokenExtractor,
  authMiddleware.userExtractor,
  userController.deleteUser
)

export default router
