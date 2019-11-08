const pool_kraken = require('../db/kraken');
const pool_bitmex = require('../db/bitmex');
const pool_binance = require('../db/binance');

const CandleModel = {
  async schema() {
    const schema = `
        pair TEXT,
        date_time TIMESTAMP NOT NULL,
        open NUMERIC NOT NULL,
        high NUMERIC NOT NULL,
        low NUMERIC NOT NULL,
        close NUMERIC NOT NULL,
        volume NUMERIC,
        PRIMARY KEY (pair, date_time)
    `;
    try {
      [pool_kraken, pool_bitmex, pool_binance].forEach(pool => {
        pool.query(`
            CREATE TABLE IF NOT EXISTS candles_1m(${schema}) 
            CREATE INDEX IF NOT EXISTS candles_1m_idx ON candles_1m (pair, date_time);
        `);
        pool.query(`
            CREATE TABLE IF NOT EXISTS candles_5m(${schema})
            CREATE INDEX IF NOT EXISTS candles_5m_idx ON candles_5m (pair, date_time);
        `);
        pool.query(`
            CREATE TABLE IF NOT EXISTS candles_1h(${schema})
            CREATE INDEX IF NOT EXISTS candles_1h_idx ON candles_1h (pair, date_time);
        `);
        pool.query(`
            CREATE TABLE IF NOT EXISTS candles_1d(${schema})
            CREATE INDEX IF NOT EXISTS candles_1d_idx ON candles_1d (pair, date_time);`);
      });
    } catch (err) {
      throw new Error('Candle table schema error');
    }
  },
};
module.exports = CandleModel;
