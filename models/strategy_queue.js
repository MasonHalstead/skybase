const pool = require('../db/skydax');

const StrategyQueueModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      strategy_id INT REFERENCES managed_strategies (id)
    `;
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS strategy_queue(${schema});`);
    } catch (err) {
      throw new Error('Status table schema error');
    }
  },
  async selectStrategyQueue() {
    const sql = {
      select: 'SELECT * FROM strategy_queue',
    };
    try {
      const res = await pool.query(sql.select);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = StrategyQueueModel;
