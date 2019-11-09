const moment = require('moment');
const cron = require('node-cron');
const BitmexEmitter = require('../subscribers/bitmex');
const helpers = require('../utils/helpers');

module.exports = async function() {
  cron.schedule('0 * * * * *', async () => {
    const dates = helpers.handleDates(moment());

    await BitmexEmitter.emit('candle_m1', { dates, pair: 'XBTUSD' });
    await BitmexEmitter.emit('candle_m1', { dates, pair: 'ETHUSD' });

    if (dates.minutes % 5 === 0) {
      await BitmexEmitter.emit('candle_m5', { dates, pair: 'XBTUSD' });
      await BitmexEmitter.emit('candle_m5', { dates, pair: 'ETHUSD' });
    }

    if (dates.minutes === 0) {
      await BitmexEmitter.emit('candle_h1', { dates, pair: 'XBTUSD' });
      await BitmexEmitter.emit('candle_m5', { dates, pair: 'ETHUSD' });
    }

    if ((0 === dates.hours || dates.hours === 1) && dates.minutes === 0) {
      await BitmexEmitter.emit('candle_d1', { dates, pair: 'XBTUSD' });
      await BitmexEmitter.emit('candle_d1', { dates, pair: 'ETHUSD' });
    }
  });
  const historic_job = cron.schedule('0-59/3 * * * * *', async () => {
    // const dates = helpers.handleDates(moment());
    // await BitmexEmitter.emit('historic_eth', { dates, historic_job });
  });
};
