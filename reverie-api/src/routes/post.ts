import express from 'express'

import postController from '../controllers/post'
import authMiddleware from '../middlewares/auth'

const router = express.Router()

router.post(
  '/',
  authMiddleware.tokenExtractor,
  authMiddleware.userExtractor,
  postController.create
)

router.get('/posts/:id', postController.getById)

router.get('/', postController.getPosts)

router.delete(
  '/posts/:id',
  authMiddleware.tokenExtractor,
  authMiddleware.userExtractor,
  postController.deletePost
)

router.patch(
  '/posts/:id',
  authMiddleware.tokenExtractor,
  authMiddleware.userExtractor,
  postController.update
)

export default router
