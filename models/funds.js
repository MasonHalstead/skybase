const pool = require('../db/skydax');

const FundModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      exchange_id INT REFERENCES exchanges (id),
      satoshi_capacity NUMERIC DEFAULT 0,
      satoshi_balance NUMERIC DEFAULT 0,
      satoshi_soft_cap NUMERIC DEFAULT 0,
      wallet_address TEXT,
      pair_id INT REFERENCES pairs (id),
      public_key TEXT,
      public_secret TEXT,
      container_image TEXT,
      reconciled_time TIMESTAMP DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT CURRENT_DATE
    `;
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS funds(${schema});`);
    } catch (err) {
      throw new Error('Fund table schema error');
    }
  },
  async selectFunds() {
    const sql = {
      select: 'SELECT * FROM funds',
    };
    try {
      const res = await pool.query(sql.select);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = FundModel;
