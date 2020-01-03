const pool = require('../db/skydax');
const moment = require('moment');

const EquityModel = {
  async schema() {
    const schema = `
      id BIGSERIAL PRIMARY KEY,
      customer_id TEXT REFERENCES users (uuid),
      pair TEXT REFERENCES pairs (combined_name),
      balance NUMERIC,
      price_conversion NUMERIC,
      date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `;
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS equity(${schema});
        CREATE INDEX IF NOT EXISTS equity_idx ON equity (customer_id, pair, date_time);
        `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS equity_h1(${schema});
        CREATE INDEX IF NOT EXISTS equity_h1_idx ON equity_h1 (customer_id, pair, date_time);
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS equity_d1(${schema});
        CREATE INDEX IF NOT EXISTS equity_d1_idx ON equity_d1 (customer_id, pair, date_time);
      `);
    } catch (err) {
      throw new Error('Equity table schema error');
    }
  },
  async createEquity({ uuid, pair, balance, price_conversion }) {
    const sql = {
      insert: `INSERT INTO equity 
      (customer_id, pair, balance, price_conversion)
      VALUES($1, $2, $3, $4)
      RETURNING *`,
    };
    try {
      const res = await pool.query(sql.insert, [
        uuid,
        pair,
        balance,
        price_conversion,
      ]);
      return res.rows[0];
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async aggregateEquities({
    customer_id,
    pair,
    from,
    into,
    truncate,
    start_date,
    end_date,
  }) {
    const sql = {
      insert: `INSERT INTO ${into}(pair, date_time, customer_id, balance, price_conversion)
        SELECT pair, 
        DATE_TRUNC('${truncate}', date_time) as composite_date_time,
        customer_id,
        AVG(balance) as avg_balance,
        AVG(price_conversion) as avg_price_conversion
        FROM ${from}
        WHERE (customer_id = '${customer_id}') 
        AND (pair = '${pair}') 
        AND (date_time between '${start_date}' and '${end_date}')
        GROUP BY customer_id, pair, composite_date_time
        ON CONFLICT DO NOTHING;
      `,
    };
    try {
      pool.query(sql.insert);
    } catch (err) {
      throw new Error('candle hourly aggregate error');
    }
  },
  async selectUserEquity({
    uuid,
    pair,
    start_date = '1970-01-01T00:00:00Z',
    end_date = moment.utc().format(),
  }) {
    const sql = {
      select: `SELECT * FROM equity 
      WHERE customer_id = $1 
      AND pair = $2
      AND date_time >= $3
      AND date_time <= $4
      ORDER BY date_time ASC
      LIMIT 100000;`,
    };
    try {
      const res = await pool.query(sql.select, [
        uuid,
        pair,
        start_date,
        end_date,
      ]);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};
module.exports = EquityModel;
