const pool = require('../db/skydax');

const StatusModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      name TEXT
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
};

module.exports = StatusModel;
