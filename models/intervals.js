const pool = require('../db/skydax');

const IntervalModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      interval TEXT,
      name TEXT,
      seconds INT,
      created_at TIMESTAMP DEFAULT CURRENT_DATE,
      updated_at TIMESTAMP DEFAULT CURRENT_DATE
    `;
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS intervals(${schema});`);
    } catch (err) {
      throw new Error('Interval table schema error');
    }
  },
  async selectIntervals() {
    const sql = {
      select: 'SELECT * FROM intervals',
    };
    try {
      const res = await pool.query(sql.select);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = IntervalModel;
