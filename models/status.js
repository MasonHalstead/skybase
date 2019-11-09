const pool = require('../db/skydax');
const data = require('../data/status.json');

const StatusModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE
    `;
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS status(${schema});`);
    } catch (err) {
      throw new Error('Status table schema error');
    }
  },
  async selectStatus() {
    const sql = {
      select: 'SELECT * FROM status',
    };
    try {
      const res = await pool.query(sql.select);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async insertStatus() {
    const sql = {
      insert: `INSERT INTO status 
      (name)
      VALUES($1)
      ON CONFLICT(name) 
      DO NOTHING`,
    };
    try {
      data.forEach(status => pool.query(sql.insert, status));
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = StatusModel;
