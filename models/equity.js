const pool = require('../db/skydax');

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
    } catch (err) {
      throw new Error('Equity table schema error');
    }
  },
  async createEquity({ uuid, pair, balance, price_conversion, date_time }) {
    const sql = {
      insert: `INSERT INTO equity 
      (customer_id, pair, balance, price_conversion, date_time)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *`,
    };
    try {
      const res = await pool.query(sql.insert, [
        uuid,
        pair,
        balance,
        price_conversion,
        date_time,
      ]);
      return res.rows[0];
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async selectUserEquity({ uuid, pair }) {
    const sql = {
      select: `SELECT * FROM equity 
      WHERE customer_id = $1 
      AND pair = $2
      LIMIT 100;`,
    };
    try {
      const res = await pool.query(sql.select, [uuid, pair]);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};
module.exports = EquityModel;
