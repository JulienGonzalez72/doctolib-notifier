import twilio from 'twilio'

const accountSid = process.env.TWILIO_USER
const authToken = process.env.TWILIO_PASSWORD
const client = twilio(accountSid, authToken)

export function notify(content: string) {
  return client.messages.create({
    body: content,
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+33662334103',
  })
}
