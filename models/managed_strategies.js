const pool = require('../db/skydax');

const ManagedStrategyModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      customer_id TEXT REFERENCES users (uuid),
      exchange_id INT REFERENCES exchanges (id),
      satoshi_fees NUMERIC DEFAULT 0,
      satoshi_deposit NUMERIC DEFAULT 0,
      satoshi_deposited NUMERIC DEFAULT 0,
      satoshi_entry NUMERIC DEFAULT 0,
      satoshi_withdraw NUMERIC DEFAULT 0,
      satoshi_withdrawn NUMERIC DEFAULT 0,
      satoshi_balance NUMERIC DEFAULT 0,
      fund_id INT REFERENCES funds (id),
      status_id INT REFERENCES status (id),
      deposit_reference TEXT,
      deposit_status TEXT,
      withdraw_reference TEXT,
      withdraw_status TEXT,
      reconciled_time TIMESTAMP DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT CURRENT_DATE
    `;
    try {
      await pool.query(
        `CREATE TABLE IF NOT EXISTS managed_strategies(${schema});`,
      );
    } catch (err) {
      throw new Error('Managed strategy table schema error');
    }
  },
  async selectUserStrategies(uuid) {
    const sql = {
      select: 'SELECT * FROM managed_strategies WHERE customer_id = $1 LIMIT 1',
    };
    try {
      const res = await pool.query(sql.select, [uuid]);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = ManagedStrategyModel;
