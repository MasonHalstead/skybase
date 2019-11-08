const pool = require('../db/skydax');

const ExchangeModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_DATE,
      updated_at TIMESTAMP DEFAULT CURRENT_DATE
    `;
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS exchanges(${schema});`);
    } catch (err) {
      throw new Error('Exchange table schema error');
    }
  },
  async selectExchanges() {
    const sql = {
      select: 'SELECT * FROM exchanges',
    };
    try {
      const res = await pool.query(sql.select);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = ExchangeModel;
