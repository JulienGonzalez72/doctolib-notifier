"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notify = void 0;
const twilio_1 = __importDefault(require("twilio"));
const accountSid = process.env.TWILIO_USER;
const authToken = process.env.TWILIO_PASSWORD;
const client = twilio_1.default(accountSid, authToken);
function notify(content) {
    return client.messages.create({
        body: content,
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+33662334103',
    });
}
exports.notify = notify;
//# sourceMappingURL=notifier.js.map