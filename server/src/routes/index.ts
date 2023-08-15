import express from 'express'
import { expressjwt } from 'express-jwt'

import indexController from '../controllers'
import environ from '../environ'

const router = express.Router()

router.get(
  '',
  expressjwt({
    secret: environ.JWT_SECRET,
    issuer: environ.ISS,
    algorithms: ['HS256'],
  }),
  indexController.initChecker
)

export default router
