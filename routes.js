import { Router } from 'express'
import basicAuth  from 'express-basic-auth'
import sessionsRoute from './routes/sessionsRoute.js'
import chatsRoute from './routes/chatsRoute.js'
import groupsRoute from './routes/groupsRoute.js'
import numberRoute from './routes/numbersRoute.js'
import response from './response.js'

const router = Router()

function customAuthorizer(username, password) {
  const userMatches = basicAuth.safeCompare(username, process.env.USERNAME)
  const passwordMatches = basicAuth.safeCompare(password, process.env.PASSWORD)
  return userMatches & passwordMatches
}

router.use(
  basicAuth({
    authorizer: customAuthorizer,
    challenge: true,
    realm: 'PN-WhatsApp',
    unauthorizedResponse: "Invalid credentials"
  })
)

router.use('/sessions', sessionsRoute)
router.use('/chats', chatsRoute)
router.use('/groups', groupsRoute)
router.use('/number', numberRoute)

router.all('*', (req, res) => {
    response(res, 404, false, 'The requested url cannot be found.')
})

export default router
