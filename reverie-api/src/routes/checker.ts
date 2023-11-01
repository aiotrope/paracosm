import express from 'express'

import checkerController from '../controllers/checker'

const router = express.Router()

router.get('', checkerController.initChecker)

export default router
