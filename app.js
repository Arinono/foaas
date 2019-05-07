const express = require('express')
const request = require('request')
const app = express()
const router = express.Router()
const port = process.env.PUBSUB_PORT || 5000

exports.getOperations = () => {
  return new Promise((resolve, reject) => {
    request.get('https://www.foaas.com/operations', (error, response, body) => {
      if (error) {
        console.error(error)
        reject(error)
      }
      console.log('Operations retrived')
      resolve(body)
    })
  })
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  req.header('Content-Tyope', 'text/plain')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

this.getOperations().then(ope => {
  for (const o of JSON.parse(ope)) {
    router.get(o.url, (req, res) => {
      let query = `${o.url.substr(
        1,
        o.url.substr(1, o.url.length).indexOf('/')
      )}/`
      for (const f of o.fields) {
        if (!req.params[f.field]) {
          console.log('Required fields not provided')
          res.status(200).send(`Required fields not provided. See: ${o.field}`)
          return
        }
        query += `${req.params[f.field]}/`
      }
      console.log(`Query found: ${query}`)
      request.get(`https://www.foaas.com/${query}`, (error, response, body) => {
        if (error) {
          console.error(error)
          res.status(200).send(error)
        }
        console.log(`Sentence received: ${body}`)
        res.status(200).send(body)
      })
    })
  }
})

app.use(router)

console.log(`App listening on port ${port}`)
app.listen(port)
