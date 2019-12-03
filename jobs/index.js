const moment = require('moment');
const cron = require('node-cron');
const BitmexEmitter = require('../subscribers/bitmex');
const KrakenEmitter = require('../subscribers/kraken');
const AggregationEmitter = require('../subscribers/aggregation');
const helpers = require('../utils/helpers');

module.exports = async function() {
  cron.schedule('0 * * * * *', async () => {
    const dates = helpers.handleDates(moment());
    await BitmexEmitter.emit('candle_m1', { dates, pair: 'XBTUSD' });
    await BitmexEmitter.emit('candle_m1', { dates, pair: 'ETHUSD' });

    await KrakenEmitter.emit('candle_m1', { dates, pair: 'XXBTZUSD' });
    await KrakenEmitter.emit('candle_m1', { dates, pair: 'XETHZUSD' });

    await BitmexEmitter.emit('composites', { dates, instrument: '.BXBT' });
    await BitmexEmitter.emit('composites_m1', { dates, instrument: '.BXBT' });

    if (dates.minutes % 5 === 0) {
      await BitmexEmitter.emit('candle_m5', { dates, pair: 'XBTUSD' });
      await BitmexEmitter.emit('candle_m5', { dates, pair: 'ETHUSD' });
      await KrakenEmitter.emit('candle_m5', { dates, pair: 'XXBTZUSD' });
      await KrakenEmitter.emit('candle_m5', { dates, pair: 'XETHZUSD' });
    }

    if (dates.minutes === 0) {
      await AggregationEmitter.emit('candle_h1', { dates, pair: 'XBTUSD' });
      await AggregationEmitter.emit('candle_h1', { dates, pair: 'ETHUSD' });
      await AggregationEmitter.emit('candle_h1', { dates, pair: 'XXBTZUSD' });
      await AggregationEmitter.emit('candle_h1', { dates, pair: 'XETHZUSD' });
    }

    if ((0 === dates.hours || dates.hours === 1) && dates.minutes === 0) {
      await AggregationEmitter.emit('candle_d1', { dates, pair: 'XBTUSD' });
      await AggregationEmitter.emit('candle_d1', { dates, pair: 'ETHUSD' });
      await AggregationEmitter.emit('candle_d1', { dates, pair: 'XXBTZUSD' });
      await AggregationEmitter.emit('candle_d1', { dates, pair: 'XETHZUSD' });
    }
  });
  // const historic_job = cron.schedule('0-59/3 * * * * *', async () => {
  //   const dates = helpers.handleDates(moment());
  //   await BitmexEmitter.emit('historic_bxbt', { dates, historic_job });
  // });
};
