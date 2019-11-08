const pool = require('../db/skydax');

const PairModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      name TEXT,
      short_name TEXT,
      combined_name TEXT,
      base TEXT,
      quote TEXT,
      on_binance BOOLEAN DEFAULT TRUE,
      on_binance_us BOOLEAN DEFAULT TRUE,
      on_bitmex BOOLEAN DEFAULT TRUE,
      on_kraken BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_DATE,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_DATE
    `;
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS pairs(${schema});`);
    } catch (err) {
      throw new Error('Pair table schema error');
    }
  },
  async selectPairs() {
    const sql = {
      select: 'SELECT * FROM pairs',
    };
    try {
      const res = await pool.query(sql.select);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = PairModel;
