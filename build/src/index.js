"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
if (!process.env.CYCLIC_APP_ID) {
    dotenv.config();
}
const express_1 = __importDefault(require("express"));
const doctolibAPI_1 = __importDefault(require("./doctolibAPI"));
const doctolibScraper_1 = __importDefault(require("./doctolibScraper"));
const notifier_1 = require("./notifier");
const MAX_DAYS = 30;
const MIN_HOUR = 9;
const MIN_MINUTES = 25;
const api = new doctolibAPI_1.default();
async function run() {
    console.log('Connecting');
    await api.connect();
    console.log('Running check');
    const { availabilities } = await api.getAvailabilities(new Date(Date.now()), 1987843, 436518);
    const slots = availabilities
        .map(a => a.slots)
        .filter(slots => slots.length)
        .flat()
        .map(slot => new Date(slot));
    const myAvailabilities = slots.filter(slot => {
        if (slot.getHours() > MIN_HOUR) {
            return true;
        }
        return slot.getHours() >= MIN_HOUR && slot.getMinutes() >= MIN_MINUTES;
    });
    const okAvailability = myAvailabilities.find(slot => {
        const diffTime = Math.abs(slot.getTime() - Date.now());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= MAX_DAYS;
    });
    let message;
    if (okAvailability) {
        message = `Prochain rendez-vous disponible : ${okAvailability.toLocaleString(new Intl.Locale('fr'))}`;
        await (0, notifier_1.notify)(message);
    }
    else {
        message = 'Aucun rendez-vous disponible';
    }
    console.log(message);
}
const scraper = new doctolibScraper_1.default();
async function run2() {
    await scraper.getAvailabilities();
}
function start() {
    console.log('Start app');
    const action = () => {
        run().catch(err => {
            console.error(err);
            // clearInterval(daemon)
        });
    };
    // const daemon = setInterval(() => {
    //   action()
    // }, 60000)
    action();
}
const server = (0, express_1.default)();
console.log('Starting server...');
server.listen(3000, () => {
    console.log('Server is running on port 3000');
    try {
        start();
    }
    catch (err) {
        console.error(err);
    }
});
//# sourceMappingURL=index.js.map