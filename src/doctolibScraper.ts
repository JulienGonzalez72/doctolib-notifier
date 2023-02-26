import {JSDOM} from 'jsdom'

export default class DoctolibScraper {
  async getAvailabilities() {
    const dom = new JSDOM('', {
      url: 'https://www.doctolib.fr/masseur-kinesitherapeute/toulouse/claire-guignet/booking/availabilities?motiveIds[]=1987843&placeId=practice-126404&specialityId=9&telehealth=false',
      contentType: 'text/html',
    })
    console.log(dom.window.document.textContent)
  }
}
