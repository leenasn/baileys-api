import 'dotenv/config'
import express from 'express'
import basicAuth  from 'express-basic-auth'
import nodeCleanup from 'node-cleanup'
import routes from './routes.js'
import { init, cleanup } from './whatsapp.js'
import __dirname from './dirname.js'

const app = express()
const host = process.env.HOST ?? '127.0.0.1'
const port = parseInt(process.env.PORT ?? 8000)

app.use(
  basicAuth({
    authorizer: customAuthorizer,
    challenge: true,
    realm: 'PN-WhatsApp',
    unauthorizedResponse: "Invalid credentials"
  })
)

function customAuthorizer(username, password) {
  const userMatches = basicAuth.safeCompare(username, process.env.USERNAME)
  const passwordMatches = basicAuth.safeCompare(password, process.env.PASSWORD)
  return userMatches & passwordMatches
}

app.get('/check',function(req,res) {
  res.sendFile(`${__dirname}/index.html`);
});

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/', routes)

app.listen(port, host, () => {
    init()
    console.log(`Server is listening on http://${host}:${port}`)
})

nodeCleanup(cleanup)

export default app
