import express from 'express'

import indexController from '../controllers/index'

const router = express.Router()

router.get('/', indexController.initChecker)

export default router
