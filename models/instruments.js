const pool = require('../db/skydax');
const data = require('../data/instruments.json');

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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  async insertInstruments() {
    const sql = {
      insert: `INSERT INTO instruments 
      (instrument, name, on_binance, on_binance_us, on_bitmex, on_kraken)
      VALUES($1, $2, $3, $4, $5, $6)
      ON CONFLICT(instrument) 
      DO NOTHING`,
    };
    try {
      data.forEach(instrument => pool.query(sql.insert, instrument));
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};
module.exports = InstrumentModel;
