const pool = require('../db/skydax');

const ActivityModel = {
  async schema() {
    const schema = `
      id SERIAL PRIMARY KEY,
      customer_id TEXT REFERENCES users (uuid),
      message TEXT,
      reference_table TEXT,
      reference_column TEXT,
      reference_id BIGINT,
      created_time DATE NOT NULL DEFAULT CURRENT_DATE
    `;
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS activity(${schema});`);
    } catch (err) {
      throw new Error('Activity table schema error');
    }
  },
  async createActivy(payload) {
    const {
      customer_id,
      message,
      reference_table,
      reference_column,
      reference_id,
    } = payload;

    const sql = {
      insert: `INSERT INTO activity 
      (customer_id, message, reference_table, reference_column, reference_id)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *`,
    };
    try {
      const res = await pool.query(sql.insert, [
        customer_id,
        message,
        reference_table,
        reference_column,
        reference_id,
      ]);
      return res.rows[0];
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async selectUserActivity(uuid) {
    const sql = {
      select: 'SELECT * FROM activity WHERE uuid = $1 LIMIT 1',
    };
    try {
      const res = await pool.query(sql.select, [uuid]);
      return res.rows;
    } catch (err) {
      throw new Error(err.detail);
    }
  },
};

module.exports = ActivityModel;
