const EventEmitter = require('events');
const AggregationEmitter = new EventEmitter();
const Candles = require('../models/candles');

AggregationEmitter.on('candle_h1', async ({ dates, pair }) => {
  // Aggregates the last 60 minutes into 1 hour candles
  try {
    ['kraken', 'bitmex', 'binance'].forEach(async db => {
      await Candles.aggregateCandles({
        pair,
        from: `${db}_candles_m1`,
        into: `${db}_candles_h1`,
        truncate: 'HOUR',
        start_date: dates.date_clone_h1,
        end_date: dates.date_utc,
      });
    });
  } catch (err) {
    throw new Error('candle hourly aggregate error');
  }
});

AggregationEmitter.on('candle_d1', async ({ dates, pair }) => {
  // Aggregates the last 60 minutes into 1 hour candles
  try {
    ['kraken', 'bitmex', 'binance'].forEach(db => {
      Candles.aggregateCandles({
        pair,
        from: `${db}_candles_h1`,
        into: `${db}_candles_d1`,
        truncate: 'DAY',
        start_date: dates.date_clone_d1,
        end_date: dates.date_clone_d0,
      });
    });
  } catch (err) {
    throw new Error('candle daily aggregate error');
  }
});

module.exports = AggregationEmitter;
