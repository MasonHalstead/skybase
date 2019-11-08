const pool = require('../db/skydax');

const InstrumentModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      instrument TEXT UNIQUE,
      name TEXT,
      on_binance BOOLEAN DEFAULT TRUE,
      on_binance_us BOOLEAN DEFAULT TRUE,
      on_bitmex BOOLEAN DEFAULT TRUE,
      on_kraken BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_DATE,
      updated_at TIMESTAMP DEFAULT CURRENT_DATE
    `;
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS instruments(${schema});`);
    } catch (err) {
      throw new Error('Instrument table schema error');
    }
  },
  async selectInstruments() {
    const sql = {
      select: 'SELECT * FROM instruments',
    };
    try {
      const res = await pool.query(sql.select);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};
module.exports = InstrumentModel;
