"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsdom_1 = require("jsdom");
class DoctolibScraper {
    async getAvailabilities() {
        const dom = new jsdom_1.JSDOM('', {
            url: 'https://www.doctolib.fr/masseur-kinesitherapeute/toulouse/claire-guignet/booking/availabilities?motiveIds[]=1987843&placeId=practice-126404&specialityId=9&telehealth=false',
            contentType: 'text/html',
        });
        console.log(dom.window.document.textContent);
    }
}
exports.default = DoctolibScraper;
//# sourceMappingURL=doctolibScraper.js.map