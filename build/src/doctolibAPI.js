"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class DoctolibAPI {
    constructor() {
        this.axios = axios_1.default.create({
            headers: {
                accept: 'application/json',
                'accept-language': 'en,fr-FR;q=0.9,fr;q=0.8,en-US;q=0.7,ar;q=0.6,de;q=0.5',
                'content-type': 'application/json; charset=utf-8',
                'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                // 'x-csrf-token': token,
                'referrer-policy': 'origin-when-cross-origin',
            },
        });
    }
    async connect() {
        const tokenData = await this.get('https://www.doctolib.fr', {
            headers: {
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            },
        });
        const tokenRegex = /"csrf-token" content="(.+?)"/.exec(tokenData);
        if (!tokenRegex || tokenRegex.length <= 1) {
            throw new Error("Can't retrieve CSRF token");
        }
        const token = tokenRegex[1];
        console.log('TOKEN 1', token);
        this.axios.defaults.headers['x-csrf-token'] = token;
        const status = await this.axios.get('https://www.doctolib.fr/patient_requests/patient_app/requests_status');
        const secondToken = status.headers['x-csrf-token'];
        console.log('TOKEN 2', secondToken);
        this.axios.defaults.headers['x-csrf-token'] = secondToken;
    }
    async getAvailabilities(startDate, motiveId, agendaId) {
        const params = {
            start_date: this.formatDate(startDate),
            visit_motive_ids: motiveId,
            agenda_ids: agendaId,
            telehealth: false,
            limit: 15,
        };
        return this.get('https://www.doctolib.fr/availabilities.json', { params });
    }
    async getProfile(firstName, lastName) {
        return this.get('https://www.doctolib.fr/online_booking/draft/new.json', {
            params: {
                id: `${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
            },
        });
    }
    async get(url, config) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.axios
                    .get(url, config)
                    .then(res => {
                    resolve(res.data);
                })
                    .catch(err => {
                    reject(err.response);
                });
            }, 1000);
        });
    }
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }
}
exports.default = DoctolibAPI;
//# sourceMappingURL=doctolibAPI.js.map