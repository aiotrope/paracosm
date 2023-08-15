import express from 'express'

import userController from '../controllers/authentication'

const router = express.Router()

router.post('/signup', userController.signup)

router.post('/login', userController.login)

export default router
