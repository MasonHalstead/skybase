const pool = require('../db/skydax');
const data = require('../data/intervals.json');

const IntervalModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      interval TEXT UNIQUE,
      name TEXT,
      seconds INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  async insertIntervals() {
    const sql = {
      insert: `INSERT INTO intervals 
      (interval, name, seconds)
      VALUES($1, $2, $3)
      ON CONFLICT(interval) 
      DO NOTHING`,
    };
    try {
      data.forEach(interval => pool.query(sql.insert, interval));
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = IntervalModel;
