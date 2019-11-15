const pool_kraken = require('../db/kraken');
const pool_bitmex = require('../db/bitmex');
const pool_binance = require('../db/binance');
const moment = require('moment');

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
            CREATE TABLE IF NOT EXISTS candles_m1(${schema});
            CREATE INDEX IF NOT EXISTS candles_m1_idx ON candles_m1 (pair, date_time);
        `);
        pool.query(`
            CREATE TABLE IF NOT EXISTS candles_m5(${schema});
            CREATE INDEX IF NOT EXISTS candles_m5_idx ON candles_m5 (pair, date_time);
        `);
        pool.query(`
            CREATE TABLE IF NOT EXISTS candles_h1(${schema});
            CREATE INDEX IF NOT EXISTS candles_h1_idx ON candles_h1 (pair, date_time);
        `);
        pool.query(`
            CREATE TABLE IF NOT EXISTS candles_d1(${schema});
            CREATE INDEX IF NOT EXISTS candles_d1_idx ON candles_d1 (pair, date_time);`);
      });
    } catch (err) {
      throw new Error('Candle table schema error');
    }
  },
  async insertKrakenCandles(candles, pair, table) {
    const sql = {
      insert: `INSERT INTO ${table} 
      (pair, date_time, open, high, low, close, volume)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT DO NOTHING`,
    };
    try {
      candles.forEach(candle => {
        const [date_time, open, high, low, close, , volume] = candle;
        pool_kraken.query(sql.insert, [
          pair,
          moment.unix(date_time).format(),
          open || 0,
          high || 0,
          low || 0,
          close || 0,
          volume * 100000000 || 0,
        ]);
      });
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async insertBitmexCandles(candles, table) {
    const sql = {
      insert: `INSERT INTO ${table} 
      (pair, date_time, open, high, low, close, volume)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT DO NOTHING`,
    };
    try {
      candles.forEach(candle => {
        const { symbol, timestamp, open, high, low, close, volume } = candle;
        pool_bitmex.query(sql.insert, [
          symbol,
          timestamp,
          open || 0,
          high || 0,
          low || 0,
          close || 0,
          volume || 0,
        ]);
      });
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async selectCandles({ database, interval, pair, start_date, end_date }) {
    const tables = {
      M1: 'candles_m1',
      M5: 'candles_m5',
      H1: 'candles_h1',
      D1: 'candles_d1',
    };
    const sql = {
      select: `SELECT * FROM ${tables[interval]}
      WHERE pair = $1
      AND date_time >= $2
      AND date_time <= $3
      LIMIT 5000;`,
    };
    try {
      if (database === 'bitmex') {
        res = await pool_bitmex.query(sql.select, [pair, start_date, end_date]);
        return res.rows;
      }
      if (database === 'kraken') {
        res = await pool_kraken.query(sql.select, [pair, start_date, end_date]);
        return res.rows;
      }
      if (database === 'binance') {
        res = await pool_binance.query(sql.select, [
          pair,
          start_date,
          end_date,
        ]);
        return res.rows;
      }
      throw new Error('Invalid database candle query');
    } catch (err) {
      throw new Error('Select candle error');
    }
  },
  async aggregateCandles({ pair, from, into, truncate, start_date, end_date }) {
    const sql = {
      insert: `INSERT INTO ${into}(pair, date_time, open, high, low, close, volume)
        SELECT pair, 
        DATE_TRUNC('${truncate}', date_time) as composite_date_time,
        (ARRAY_AGG(open ORDER BY date_time ASC))[1] as first_open,
        MAX(high) as max_high,
        MIN(low) as min_low,
        (ARRAY_AGG(close ORDER BY date_time DESC))[1] as last_close,
        SUM(volume) as sum_volume
        FROM ${from}
        WHERE (pair = '${pair}') 
        AND (date_time between '${start_date}' and '${end_date}')
        GROUP BY pair, composite_date_time
        ON CONFLICT DO NOTHING;
      `,
    };
    try {
      [pool_kraken, pool_bitmex, pool_binance].forEach(pool => {
        pool.query(sql.insert);
      });
    } catch (err) {
      throw new Error('candle hourly aggregate error');
    }
  },
};
module.exports = CandleModel;
