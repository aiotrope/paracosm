import express from 'express'
import { expressjwt } from 'express-jwt'

import environ from '../environ'

import postController from '../controllers/post'
// import authMiddleware from '../middlewares/auth'

const router = express.Router()

router.post(
  '/posts',
  expressjwt({
    secret: environ.JWT_SECRET,
    issuer: environ.ISS,
    algorithms: ['HS256'],
  }),
  postController.create
)

router.get('/posts/:id', postController.getById)

router.get('/posts', postController.getPosts)

router.delete(
  '/posts/:id',
  expressjwt({
    secret: environ.JWT_SECRET,
    issuer: environ.ISS,
    algorithms: ['HS256'],
  }),
  postController.deletePost
)

router.put(
  '/posts/:id',
  expressjwt({
    secret: environ.JWT_SECRET,
    issuer: environ.ISS,
    algorithms: ['HS256'],
  }),
  postController.updatePost
)

export default router
