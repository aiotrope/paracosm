import express from 'express'
import { expressjwt } from 'express-jwt'

import environ from '../environ'
import checkerController from '../controllers/checker'

const router = express.Router()

router.get(
  '',
  expressjwt({
    secret: environ.JWT_SECRET,
    issuer: environ.ISS,
    algorithms: ['HS256'],
  }),
  checkerController.initChecker
)

export default router
