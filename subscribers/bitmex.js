const EventEmitter = require('events');
const BitmexEmitter = new EventEmitter();
const moment = require('moment');
const Bitmex = require('../utils/bitmex');
const Candles = require('../models/candles');
const Composites = require('../models/composites');

let historic_xbt_date = '2016-05-05T04:01:00Z';
let historic_eth_date = '2018-08-02T09:02:00Z';
let historic_bxbt_date = '2019-10-24T00:00:00Z';

BitmexEmitter.on('candle_m1', async ({ dates, pair }) => {
  // Collects the last 2 minutes 1m candles
  const candles = await Bitmex.handleCandles({
    pair,
    interval: '1m',
    start_date: dates.date_clone_m2,
    end_date: dates.date_utc,
  });
  Candles.insertBitmexCandles(candles, 'candles_m1');
});

BitmexEmitter.on('candle_m5', async ({ dates, pair }) => {
  // Collects the last 5 minutes 1m candles
  const candles_m1 = await Bitmex.handleCandles({
    pair,
    interval: '1m',
    start_date: dates.date_clone_m5,
    end_date: dates.date_utc,
  });
  await Candles.insertBitmexCandles(candles_m1, 'candles_m1');

  // Collects the last 10 minutes 5m candles
  const candles_m10 = await Bitmex.handleCandles({
    pair,
    interval: '5m',
    start_date: dates.date_clone_m10,
    end_date: dates.date_utc,
  });
  await Candles.insertBitmexCandles(candles_m10, 'candles_m5');
});

BitmexEmitter.on('composites', async ({ dates, instrument }) => {
  // Collects the last 2 minutes 1m candles
  const composites = await Bitmex.handleComposites({
    instrument,
    start_date: dates.date_clone_m2,
    end_date: dates.date_utc,
  });
  Composites.insertBitmexComposite(composites, 'composites');
});

BitmexEmitter.on('composites_m1', async ({ dates, instrument }) => {
  // Aggregates the last 60 seconds into 1 minute composites
  await Composites.aggregateComposites({
    instrument,
    from: 'composites',
    into: 'composites_m1',
    truncate: 'MINUTE',
    start_date: dates.date_clone_m2,
    end_date: dates.date_utc,
  });
});

BitmexEmitter.on('historic_xbt', async ({ dates, historic_job }) => {
  if (historic_xbt_date >= dates.date_now) {
    historic_job.stop();
  }
  console.log('XBTUSD', historic_xbt_date);
  const candles_m1 = await Bitmex.handleCandles({
    instrument: 'XBTUSD',
    interval: '1m',
    start_date: historic_xbt_date,
    end_date: dates.date_utc,
  });

  await Candles.insertBitmexCandles(candles_m1, 'candles_m1');
  historic_xbt_date = moment(historic_xbt_date)
    .utc()
    .add(1000, 'minutes')
    .format();
});

BitmexEmitter.on('historic_eth', async ({ dates, historic_job }) => {
  if (historic_eth_date >= dates.date_now) {
    historic_job.stop();
  }
  console.log('ETHUSD', historic_eth_date);
  const candles_m1 = await Bitmex.handleCandles({
    instrument: 'ETHUSD',
    interval: '1m',
    start_date: historic_eth_date,
    end_date: dates.date_utc,
  });

  await Candles.insertBitmexCandles(candles_m1, 'candles_m1');
  historic_eth_date = moment(historic_eth_date)
    .utc()
    .add(1000, 'minutes')
    .format();
});

BitmexEmitter.on('historic_bxbt', async ({ dates, historic_job }) => {
  if (historic_bxbt_date >= dates.date_now) {
    historic_job.stop();
  }
  console.log('.BXBT', historic_bxbt_date);
  const composites = await Bitmex.handleComposites({
    instrument: '.BXBT',
    start_date: historic_bxbt_date,
    end_date: dates.date_utc,
  });
  await Composites.insertBitmexComposite(composites, 'composites');
  historic_bxbt_date = moment(historic_bxbt_date)
    .utc()
    .add(40, 'minutes')
    .format();
});

module.exports = BitmexEmitter;
