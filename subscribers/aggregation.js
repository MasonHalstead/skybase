const EventEmitter = require('events');
const AggregationEmitter = new EventEmitter();
const Candles = require('../models/candles');

AggregationEmitter.on('candle_h1', async ({ dates, pair }) => {
  // Aggregates the last 60 minutes into 1 hour candles
  await Candles.aggregateCandles({
    pair,
    from: 'candles_m1',
    into: 'candles_h1',
    truncate: 'HOUR',
    start_date: dates.date_clone_h1,
    end_date: dates.date_utc,
  });
});

AggregationEmitter.on('candle_d1', async ({ dates, pair }) => {
  // Aggregates the last 60 minutes into 1 hour candles
  await Candles.aggregateCandles({
    pair,
    from: 'candles_h1',
    into: 'candles_d1',
    truncate: 'DAY',
    start_date: dates.date_clone_d1,
    end_date: dates.date_clone_d0,
  });
});

module.exports = AggregationEmitter;
