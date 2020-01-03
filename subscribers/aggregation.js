const EventEmitter = require('events');
const AggregationEmitter = new EventEmitter();
const Candles = require('../models/candles');
const Equity = require('../models/equity');
const users = [
  'f0c73640-0e63-11ea-9171-d5e2b97035d6',
  'ec566a70-0e6a-11ea-9c12-4775634a35ca',
];
const exchanges = ['kraken', 'bitmex', 'binance'];

AggregationEmitter.on('equity_h1', async ({ dates, pair }) => {
  // Aggregates the last 60 minutes into 1 hour candles
  try {
    users.forEach(async customer_id => {
      await Equity.aggregateEquities({
        customer_id,
        pair,
        from: `equity`,
        into: `equity_h1`,
        truncate: 'HOUR',
        start_date: dates.date_clone_h1,
        end_date: dates.date_utc,
      });
    });
  } catch (err) {
    throw new Error('equity hourly aggregate error');
  }
});

AggregationEmitter.on('equity_d1', async ({ dates, pair }) => {
  // Aggregates the last 60 minutes into 1 hour candles
  try {
    users.forEach(async customer_id => {
      await Equity.aggregateEquities({
        customer_id,
        pair,
        from: `equity_h1`,
        into: `equity_d1`,
        truncate: 'DAY',
        start_date: dates.date_clone_d1,
        end_date: dates.date_clone_d0,
      });
    });
  } catch (err) {
    throw new Error('equity daily aggregate error');
  }
});

AggregationEmitter.on('candle_h1', async ({ dates, pair }) => {
  // Aggregates the last 60 minutes into 1 hour candles
  try {
    exchanges.forEach(async db => {
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
    exchanges.forEach(db => {
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
