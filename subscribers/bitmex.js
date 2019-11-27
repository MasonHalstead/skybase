const EventEmitter = require('events');
const BitmexEmitter = new EventEmitter();
const moment = require('moment');
const Bitmex = require('../utils/bitmex');
const Candles = require('../models/candles');
const Composites = require('../models/composites');

let historic_xbt_date = '2016-05-01T00:00:00Z';
let historic_eth_date = '2018-07-01T00:00:00Z';
let historic_bxbt_date = '2017-03-10T00:00:00.000Z';

BitmexEmitter.on('candle_m1', async ({ dates, pair }) => {
  // Collects the last 2 minutes 1m candles
  try {
    const candles = await Bitmex.handleCandles({
      pair,
      interval: '1m',
      start_date: dates.date_clone_m2,
      end_date: dates.date_utc,
    });
    Candles.insertBitmexCandles(candles, 'bitmex_candles_m1');
  } catch {
    throw new Error('Error collecting Bitmex candles');
  }
});

BitmexEmitter.on('candle_m5', async ({ dates, pair }) => {
  // Collects the last 5 minutes 1m candles
  try {
    const candles_m1 = await Bitmex.handleCandles({
      pair,
      interval: '1m',
      start_date: dates.date_clone_m5,
      end_date: dates.date_utc,
    });
    await Candles.insertBitmexCandles(candles_m1, 'bitmex_candles_m1');
  } catch {
    throw new Error('Error collecting Bitmex candles');
  }

  // Collects the last 10 minutes 5m candles
  try {
    const candles_m10 = await Bitmex.handleCandles({
      pair,
      interval: '5m',
      start_date: dates.date_clone_m10,
      end_date: dates.date_utc,
    });
    await Candles.insertBitmexCandles(candles_m10, 'bitmex_candles_m5');
  } catch {
    throw new Error('Error collecting Bitmex candles');
  }
});

BitmexEmitter.on('composites', async ({ dates, instrument }) => {
  // Collects the last 2 minutes 1m candles
  try {
    const composites = await Bitmex.handleComposites({
      instrument,
      start_date: dates.date_clone_m2,
      end_date: dates.date_utc,
    });
    Composites.insertBitmexComposite(composites, 'bitmex_composites');
  } catch {
    throw new Error('Error collecting Bitmex composites');
  }
});

BitmexEmitter.on('composites_m1', async ({ dates, instrument }) => {
  // Aggregates the last 60 seconds into 1 minute composites
  try {
    await Composites.aggregateComposites({
      instrument,
      from: 'bitmex_composites',
      into: 'bitmex_composites_m1',
      truncate: 'MINUTE',
      start_date: dates.date_clone_m2,
      end_date: dates.date_utc,
    });
  } catch {
    throw new Error('Error aggregating Bitmex composites');
  }
});

BitmexEmitter.on('historic_xbt', async ({ dates, historic_job }) => {
  if (historic_xbt_date >= dates.date_now) {
    historic_job.stop();
  }
  try {
    console.log('XBTUSD', historic_xbt_date);
    const candles_m1 = await Bitmex.handleCandles({
      pair: 'XBTUSD',
      interval: '1m',
      start_date: historic_xbt_date,
      end_date: dates.date_utc,
    });
    await Candles.insertBitmexCandles(candles_m1, 'bitmex_candles_m1');
    historic_xbt_date = moment(historic_xbt_date)
      .utc()
      .add(1000, 'minutes')
      .format();
  } catch {
    throw new Error('Error collecting historic Bitmex XBTUSD candles');
  }
});

BitmexEmitter.on('historic_eth', async ({ dates, historic_job }) => {
  if (historic_eth_date >= dates.date_now) {
    historic_job.stop();
  }
  try {
    console.log('ETHUSD', historic_eth_date);
    const candles_m1 = await Bitmex.handleCandles({
      pair: 'ETHUSD',
      interval: '1m',
      start_date: historic_eth_date,
      end_date: dates.date_utc,
    });

    await Candles.insertBitmexCandles(candles_m1, 'bitmex_candles_m1');
    historic_eth_date = moment(historic_eth_date)
      .utc()
      .add(1000, 'minutes')
      .format();
  } catch {
    throw new Error('Error collecting historic Bitmex ETHUSD candles');
  }
});

BitmexEmitter.on('historic_bxbt', async ({ dates, historic_job }) => {
  if (historic_bxbt_date >= dates.date_now) {
    historic_job.stop();
  }
  try {
    console.log('.BXBT', historic_bxbt_date);
    const composites = await Bitmex.handleComposites({
      instrument: '.BXBT',
      start_date: historic_bxbt_date,
      end_date: dates.date_utc,
    });
    await Composites.insertBitmexComposite(composites, 'bitmex_composites');
    historic_bxbt_date = moment(historic_bxbt_date)
      .utc()
      .add(40, 'minutes')
      .format();
  } catch {
    throw new Error('Error collecting historic Bitmex .BXBT composites');
  }
});

module.exports = BitmexEmitter;
