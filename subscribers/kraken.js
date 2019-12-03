const EventEmitter = require('events');
const KrakenEmitter = new EventEmitter();
const moment = require('moment');
const KrakenService = require('../services/kraken');
const Candles = require('../models/candles');

KrakenEmitter.on('candle_m1', async ({ dates, pair }) => {
  // Collects the last 2 minutes 1m candles
  try {
    const unix_m2 = await moment(dates.date_clone_m2).unix();
    const candles = await KrakenService.selectJobCandles({
      pair,
      unix: unix_m2,
      interval: 1,
    });
    Candles.insertKrakenCandles(candles, pair, 'kraken_candles_m1');
  } catch (err) {
    throw new Error('Error collecting Kraken candles');
  }
});

KrakenEmitter.on('candle_m5', async ({ dates, pair }) => {
  // Collects the last 5 minutes 1m candles
  try {
    const unix_m5 = await moment(dates.date_clone_m5).unix();
    const candles_m1 = await KrakenService.selectJobCandles({
      pair,
      unix: unix_m5,
      interval: 1,
    });
    Candles.insertKrakenCandles(candles_m1, pair, 'kraken_candles_m1');
  } catch {
    throw new Error('Error collecting Kraken candles');
  }

  // Collects the last 10 minutes 5m candles
  try {
    const unix_m10 = await moment(dates.date_clone_m10).unix();
    const candles_m5 = await KrakenService.selectJobCandles({
      pair,
      unix: unix_m10,
      interval: 5,
    });
    Candles.insertKrakenCandles(candles_m5, pair, 'kraken_candles_m5');
  } catch {
    throw new Error('Error collecting Kraken candles');
  }
});

module.exports = KrakenEmitter;
