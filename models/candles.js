const pool = require('../db/skydax');
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
      ['kraken', 'bitmex', 'binance'].forEach(db => {
        pool.query(`
            CREATE TABLE IF NOT EXISTS ${db}_candles_m1(${schema});
            CREATE INDEX IF NOT EXISTS candles_m1_idx ON ${db}_candles_m1 (pair, date_time);
        `);
        pool.query(`
            CREATE TABLE IF NOT EXISTS ${db}_candles_m5(${schema});
            CREATE INDEX IF NOT EXISTS candles_m5_idx ON ${db}_candles_m5 (pair, date_time);
        `);
        pool.query(`
            CREATE TABLE IF NOT EXISTS ${db}_candles_h1(${schema});
            CREATE INDEX IF NOT EXISTS candles_h1_idx ON ${db}_candles_h1 (pair, date_time);
        `);
        pool.query(`
            CREATE TABLE IF NOT EXISTS ${db}_candles_d1(${schema});
            CREATE INDEX IF NOT EXISTS candles_d1_idx ON ${db}_candles_d1 (pair, date_time);`);
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
        pool.query(sql.insert, [
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
        pool.query(sql.insert, [
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
  async selectCandles({ db, interval, pair, start_date, end_date }) {
    const tables = {
      M1: `${db}_candles_m1`,
      M5: `${db}_candles_m5`,
      H1: `${db}_candles_h1`,
      D1: `${db}_candles_d1`,
    };
    const sql = {
      select: `SELECT * FROM ${tables[interval]}
      WHERE pair = $1
      AND date_time >= $2
      AND date_time <= $3
      LIMIT 5000;`,
    };
    try {
      res = await pool.query(sql.select, [pair, start_date, end_date]);
      return res.rows;
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
      pool.query(sql.insert);
    } catch (err) {
      throw new Error('candle hourly aggregate error');
    }
  },
};
module.exports = CandleModel;
