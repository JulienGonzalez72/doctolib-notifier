import * as dotenv from 'dotenv'
if (!process.env.CYCLIC_APP_ID) {
  dotenv.config()
}
import express from 'express'
import DoctolibAPI from './doctolibAPI'
import {notify} from './notifier'

const api = new DoctolibAPI()

async function run() {
  console.log('Run check')
  const {availabilities} = await api.getAvailabilities(
    new Date(Date.now()),
    1987843,
    436518
  )
  const slots = availabilities
    .map(a => a.slots)
    .filter(slots => slots.length)
    .flat()
    .map(slot => new Date(slot))
  const myAvailabilities = slots.filter(slot => slot.getHours() > 17)
  await notify(`${myAvailabilities.length} Rendez-vous disponibles`)
}

function start() {
  console.log('Start app')
  const daemon = setInterval(() => {
    run().catch(err => {
      console.error(err)
      clearInterval(daemon)
    })
  }, 10000)
}

const server = express()
console.log('Starting server...')
server.listen(3000, () => {
  console.log('Server is running on port 3000')
})

server.post('/check', (_req, res) => {
  console.log('POST')
  run()
    .then(() => {
      console.log('Execution successful')
      res.sendStatus(200)
    })
    .catch(err => {
      console.error(err)
      res.sendStatus(500)
    })
})
