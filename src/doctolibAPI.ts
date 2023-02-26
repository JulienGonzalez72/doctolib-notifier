import axios, {AxiosInstance, AxiosRequestConfig} from 'axios'
import {Availabilities, AvailabilitiesParams} from './types'

export default class DoctolibAPI {
  axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      headers: {
        accept: 'application/json',
        'accept-language':
          'en,fr-FR;q=0.9,fr;q=0.8,en-US;q=0.7,ar;q=0.6,de;q=0.5',
        'content-type': 'application/json; charset=utf-8',
        'sec-ch-ua':
          '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        // 'x-csrf-token': token,
        'referrer-policy': 'origin-when-cross-origin',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }

  async connect() {
    const tokenData = await this.get<string>('https://www.doctolib.fr', {
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      },
    })
    const tokenRegex = /"csrf-token" content="(.+?)"/.exec(tokenData)
    if (!tokenRegex || tokenRegex.length <= 1) {
      throw new Error("Can't retrieve CSRF token")
    }
    const token = tokenRegex[1]
    console.log('TOKEN 1', token)
    this.axios.defaults.headers['x-csrf-token'] = token

    const status = await this.axios.get(
      'https://www.doctolib.fr/patient_requests/patient_app/requests_status'
    )
    const secondToken = status.headers['x-csrf-token']
    console.log('TOKEN 2', secondToken)
    this.axios.defaults.headers['x-csrf-token'] = secondToken
  }

  async getAvailabilities(startDate: Date, motiveId: number, agendaId: number) {
    const params: AvailabilitiesParams = {
      start_date: this.formatDate(startDate),
      visit_motive_ids: motiveId,
      agenda_ids: agendaId,
      telehealth: false,
      limit: 15,
    }
    return this.get<Availabilities>(
      'https://www.doctolib.fr/availabilities.json',
      {params}
    )
  }

  async getProfile(firstName: string, lastName: string) {
    return this.get('https://www.doctolib.fr/online_booking/draft/new.json', {
      params: {
        id: `${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      },
    })
  }

  private async get<T>(url: string, config?: AxiosRequestConfig) {
    return new Promise<T>((resolve, reject) => {
      console.log('START PROMISE')
      this.axios
        .get(url, config)
        .then(res => {
          console.log('YES')
          resolve(res.data)
        })
        .catch(err => {
          console.error('GET ERROR', err)
          reject(err.response)
        })
    })
  }

  private formatDate(date: Date) {
    return date.toISOString().split('T')[0]
  }
}
