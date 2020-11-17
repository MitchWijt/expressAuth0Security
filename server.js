const express = require('express')
const app = express()
const jwt = require('express-jwt')
const jwtAuthz = require('express-jwt-authz')
const jwksRsa = require('jwks-rsa')

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKSURI
  }),

  audience: 'https://quickstarts/api',
  issuer: process.env.ISSUER,
  algorithms: ['RS256']
})

app.get('/api/public', function (req, res) {
  res.json({
    message: 'This is a public endpoint'
  })
})

app.get('/api/private', checkJwt, function (req, res) {
  res.json({
    message: 'This is a private endpoint, which needs authentication'
  })
})

const checkScopes = jwtAuthz(['read:messages'])

app.get('/api/private-scoped', checkJwt, checkScopes, function (req, res) {
  res.json({
    message: 'This is a private endpoint with a read:messages scope in it'
  })
})

app.listen(3001, () => console.log('server is running'))
