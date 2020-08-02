import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import axios from 'axios'
import config from './config'
import Html from '../client/html'

const Root = () => ''

try {
  // eslint-disable-next-line import/no-unresolved
  // ;(async () => {
  //   const items = await import('../dist/assets/js/root.bundle')
  //   console.log(JSON.stringify(items))

  //   Root = (props) => <items.Root {...props} />
  //   console.log(JSON.stringify(items.Root))
  // })()
  console.log(Root)
} catch (ex) {
  console.log(' run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

const { readFile, writeFile } = require('fs').promises

const read = (file) => {
  return readFile(`${__dirname}/${file}.json`, { encoding: 'utf8' }).then(
    (data) => JSON.parse(data) /* вернется текст, а не объект джаваскрипта */
  )
}

const write = (data) => {
  return writeFile(`${__dirname}/logs.json`, JSON.stringify(data), { encoding: 'utf8' })
}

server.get('/api/v1/products', async (req, res) => {
  const products = await read('data')
  res.json({ products })
})

server.get('/api/v1/currency', async (req, res) => {
  const { data: currency } = await axios.get(
    'https://api.exchangeratesapi.io/latest?symbols=USD,CAD'
  )
  res.json(currency)
})

server.get('/api/v1/logs', async (req, res) => {
  const logs = await read('logs')
  res.json(logs)
})

server.post('/api/v1/logs', async (req, res) => {
  const products = await read('data')
  const logs = await read('logs')
  let newLog
  if (req.body.type === 'ADD_SELECTION') {
    newLog = {
      time: new Date(),
      event: `add ${products.find((el) => el.id === req.body.id).title} to the basket`
    }
  } else if (req.body.type === 'REMOVE_SELECTION') {
    newLog = {
      time: new Date(),
      event: `remove ${products.find((el) => el.id === req.body.id).title} from the basket`
    }
  } else if (req.body.type === 'SET_BASE') {
    newLog = {
      time: new Date(),
      event: `currency was changed to ${req.body.base}`
    }
  } else if (req.body.type === 'SET_CATALOG') {
    newLog = {
      time: new Date(),
      event: `type of sorting was changed to ${req.body.sortType}`
    }
  }
  const updatedLogs = [...logs, newLog]
  await write(updatedLogs)
  res.json({ status: 'ok' })
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Boilerplate'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
