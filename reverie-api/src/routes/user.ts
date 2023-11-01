import express from 'express'

import userController from '../controllers/user'

const router = express.Router()

router.post('/signup', userController.signup)
router.get('/users', userController.getUsers)
router.get('/users/:id', userController.getById)

// router.post('/login', userController.login)

export default router
