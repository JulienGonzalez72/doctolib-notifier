import * as dotenv from 'dotenv'
if (!process.env.CYCLIC_APP_ID) {
  dotenv.config()
}
import express from 'express'
import DoctolibAPI from './doctolibAPI'
import DoctolibScraper from './doctolibScraper'
import {notify} from './notifier'

const MAX_DAYS = 14
const MIN_HOUR = 17
const MIN_MINUTES = 25

const api = new DoctolibAPI()

async function run() {
  console.log('Running check')
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
  const myAvailabilities = slots.filter(slot => {
    if (slot.getHours() > MIN_HOUR) {
      return true
    }
    return slot.getHours() >= MIN_HOUR && slot.getMinutes() >= MIN_MINUTES
  })
  const okAvailability = myAvailabilities.find(slot => {
    const diffTime = Math.abs(slot.getTime() - Date.now())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= MAX_DAYS
  })
  let message
  if (okAvailability) {
    message = `Prochain rendez-vous disponible : ${okAvailability.toLocaleString(
      new Intl.Locale('fr')
    )}`
    await notify(message)
  } else {
    message = 'Aucun rendez-vous disponible'
  }
  console.log(message)
}

const scraper = new DoctolibScraper()

async function run2() {
  await scraper.getAvailabilities()
}

function start() {
  console.log('Start app')
  const action = () => {
    run().catch(err => {
      console.error(err)
      // clearInterval(daemon)
    })
  }
  // const daemon = setInterval(() => {
  //   action()
  // }, 60000)
  action()
}

const server = express()
console.log('Starting server...')
server.listen(3000, () => {
  console.log('Server is running on port 3000')
  try {
    start()
  } catch (err) {
    console.error(err)
  }
})
