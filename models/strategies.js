const pool = require('../db/skydax');

const StrategyModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      customer_id TEXT REFERENCES users (uuid),
      exchange_id INT REFERENCES exchanges (id),
      satoshi_fees NUMERIC DEFAULT 0,
      satoshi_entry NUMERIC DEFAULT 0,
      satoshi_current NUMERIC DEFAULT 0,
      satoshi_unrealised NUMERIC DEFAULT 0,
      portfolio_balance NUMERIC DEFAULT 0,
      status_id INT REFERENCES status (id),
      pair_id INT REFERENCES pairs (id),
      fee_reference TEXT,
      fee_status TEXT,
      container_image TEXT,
      reconciled_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `;
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS strategies(${schema});`);
    } catch (err) {
      throw new Error('Fund table schema error');
    }
  },
  async selectUserStrategies(uuid) {
    const sql = {
      select: 'SELECT * FROM strategies WHERE customer_id = $1 LIMIT 1',
    };
    try {
      const res = await pool.query(sql.select, [uuid]);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = StrategyModel;
