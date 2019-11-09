const pool = require('../db/skydax');
const data = require('../data/exchanges.json');

const ExchangeModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE,
      database TEXT UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  async insertExchanges() {
    const sql = {
      insert: `INSERT INTO exchanges 
      (name, database)
      VALUES($1, $2)
      ON CONFLICT(name) 
      DO NOTHING`,
    };
    try {
      data.forEach(exchange => pool.query(sql.insert, exchange));
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = ExchangeModel;
