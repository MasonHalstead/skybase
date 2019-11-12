const EventEmitter = require('events');
const Twilio = require('twilio');
const TextEmitter = new EventEmitter();
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER } = process.env;
const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

TextEmitter.on('verify_telephone', user => {
  client.messages.create({
    to: user.telephone,
    from: TWILIO_NUMBER,
    body: `Use ${user.telephone_verification} as Skydax telephone verification.`,
  });
});

TextEmitter.on('order', ({ user, activity }) => {
  client.messages.create({
    to: user.telephone,
    from: TWILIO_NUMBER,
    body: activity.message,
  });
});

module.exports = TextEmitter;
