"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
dotenv.config();
const doctolibAPI_1 = __importDefault(require("./doctolibAPI"));
const notifier_1 = require("./notifier");
const api = new doctolibAPI_1.default();
async function run() {
    // await api.connect()
    const { availabilities } = await api.getAvailabilities(new Date(Date.now()), 1987843, 436518);
    const slots = availabilities
        .map(a => a.slots)
        .filter(slots => slots.length)
        .flat()
        .map(slot => new Date(slot));
    const myAvailabilities = slots.filter(slot => slot.getHours() > 17);
    await notifier_1.notify(`${myAvailabilities.length} Rendez-vous disponibles`);
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