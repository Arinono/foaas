const fs = require('fs')
const yamljs = require('yamljs')
const path = require('path')
const getOperations = require('./app').getOperations
const port = process.env.PUBSUB_PORT || 5000

getOperations().then(ope => {
  const json = {
    omg: 1,
    lifecycle: { startup: { command: ['node', 'app.js'] } },
    info: {
      version: '1.0.0',
      title: 'FOAAS',
      description: 'FOAAS as a OMG microservice',
      license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
      contact: {
        name: 'Aurelien ARINO',
        url: 'https://storyscript.io',
        email: 'aurelien@storyscript.io'
      }
    },
    health: {
      http: {
        path: '/health',
        port: 5000
      }
    }
  }
  json.actions = {}
  for (const o of JSON.parse(ope)) {
    const action = o.url
      .substr(1, o.url.substr(1, o.url.length).indexOf('/'))
      .replace('-', '_')
    if (o && action.length > 0) {
      json.actions[action] = {}
      json.actions[action].help = o.name
      if (o.fields.length > 0) {
        json.actions[action].arguments = {}
        for (const f of o.fields) {
          json.actions[action].arguments[f.field] = {}
          json.actions[action].arguments[f.field].type = 'string'
          json.actions[action].arguments[f.field].in = 'query'
          //json.actions[action].arguments[f.field].help = f.name
        }
      }
      json.actions[action].http = {
        port: port,
        method: 'get',
        path: o.url.substr(0, action.length + 1),
        contentType: 'application/json'
      }
      json.actions[action].output = { type: 'string' }
    }
  }
  console.log(yamljs.stringify(json, 5, 2))
  fs.writeFileSync(
    path.join(process.cwd(), 'microservice.yml'),
    yamljs.stringify(json, 5, 2)
  )
  process.exit(0)
})
