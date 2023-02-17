// import * as dotenv from 'dotenv'
// dotenv.config()
console.log('ENV', process.env)
import DoctolibAPI from './doctolibAPI'
import {notify} from './notifier'

const api = new DoctolibAPI()

async function run() {
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
  const daemon = setInterval(() => {
    run().catch(err => {
      console.error(err)
      clearInterval(daemon)
    })
  }, 10000)
}

try {
  start()
} catch (err) {
  console.error(err)
}
