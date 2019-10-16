const express = require('express')
const request = require('request')
const app = express()
const router = express.Router()
const port = 5000

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

this.getOperations()
  .then(ope => {
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      )
      next()
    })

    JSON.parse(ope).forEach(o => {
      router.get(o.url, (req, res) => {
        let query = `${o.url.substr(
          1,
          o.url.substr(1, o.url.length).indexOf('/')
        )}/`
        o.fields.forEach(f => {
          if (!req.params[f.field]) {
            console.log('Required fields not provided')
            res
              .status(200)
              .send(`Required fields not provided. See: ${o.field}`)
            return
          }
          query += `${req.params[f.field]}/`
        })
        console.log(`Query found: ${query}`)
        request.get(
          {
            url: `https://www.foaas.com/${query}`,
            headers: {
              Accept: 'text/plain'
            }
          },
          (error, response, body) => {
            if (error) {
              console.error(error)
              res.status(200).send(error)
            }
            console.log(`Sentence received: ${body}`)
            res.status(200).send(body)
          }
        )
      })
    })

    router.get('/health', (req, res) => {
      res.status(200).send()
    })

    app.use(router)

    console.log(`App listening on port ${port}`)
    app.listen(port)
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
