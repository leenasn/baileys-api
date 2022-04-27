import { Router } from 'express'
import { body, query } from 'express-validator'
import requestValidator from './../middlewares/requestValidator.js'
import sessionValidator from './../middlewares/sessionValidator.js'
import * as controller from './../controllers/numbersController.js'

const router = Router()

router.get(
    '/check/:id',
    query('receiver').notEmpty(),
    requestValidator,
    sessionValidator,
    controller.check
)

export default router
