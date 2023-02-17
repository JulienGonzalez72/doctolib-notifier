"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as dotenv from 'dotenv'
// dotenv.config()
console.log('ENV', process.env);
const doctolibAPI_1 = __importDefault(require("./doctolibAPI"));
const notifier_1 = require("./notifier");
const api = new doctolibAPI_1.default();
async function run() {
    const { availabilities } = await api.getAvailabilities(new Date(Date.now()), 1987843, 436518);
    const slots = availabilities
        .map(a => a.slots)
        .filter(slots => slots.length)
        .flat()
        .map(slot => new Date(slot));
    const myAvailabilities = slots.filter(slot => slot.getHours() > 17);
    await (0, notifier_1.notify)(`${myAvailabilities.length} Rendez-vous disponibles`);
}
function start() {
    const daemon = setInterval(() => {
        run().catch(err => {
            console.error(err);
            clearInterval(daemon);
        });
    }, 10000);
}
try {
    start();
}
catch (err) {
    console.error(err);
}
//# sourceMappingURL=index.js.map