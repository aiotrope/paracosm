import express from 'express'

import authenticationController from '../controllers/authentication'

const router = express.Router()

router.post('/signup', authenticationController.signup)

router.post('/login', authenticationController.login)

router.post('/jwt/refresh', authenticationController.refresh)

export default router
