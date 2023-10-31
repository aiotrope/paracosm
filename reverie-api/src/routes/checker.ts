import express from 'express'
// import { expressjwt } from 'express-jwt'

import checkerController from '../controllers/checker'
// import environ from '../environ'

const router = express.Router()

router.get('', checkerController.initChecker)

export default router
