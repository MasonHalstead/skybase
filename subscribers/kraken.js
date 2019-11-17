const EventEmitter = require('events');
const KrakenEmitter = new EventEmitter();
const moment = require('moment');
const Kraken = require('../utils/kraken');
const Candles = require('../models/candles');

KrakenEmitter.on('candle_m1', async ({ dates, pair }) => {
  // Collects the last 2 minutes 1m candles
  const unix_m2 = moment(dates.date_clone_m2).unix();
  const candles = await Kraken.handleRequest({
    route: `/0/public/OHLC?pair=${pair}&interval=1&since=${unix_m2}`,
  });
  Candles.insertKrakenCandles(candles[pair], pair, 'kraken_candles_m1');
});

KrakenEmitter.on('candle_m5', async ({ dates, pair }) => {
  // Collects the last 5 minutes 1m candles
  const unix_m5 = moment(dates.date_clone_m5).unix();
  const candles_m1 = await Kraken.handleRequest({
    route: `/0/public/OHLC?pair=${pair}&interval=1&since=${unix_m5}`,
  });
  Candles.insertKrakenCandles(candles_m1[pair], pair, 'kraken_candles_m1');

  // Collects the last 10 minutes 5m candles
  const unix_m10 = moment(dates.date_clone_m10).unix();
  const candles_m5 = await Kraken.handleRequest({
    route: `/0/public/OHLC?pair=${pair}&interval=5&since=${unix_m10}`,
  });
  Candles.insertKrakenCandles(candles_m5[pair], pair, 'kraken_candles_m5');
});

module.exports = KrakenEmitter;
