const pool_bitmex = require('../db/bitmex');

const CompositeModel = {
  async schema() {
    const schema = `
        instrument TEXT,
        date_time TIMESTAMP NOT NULL,
        price NUMERIC NOT NULL,
        PRIMARY KEY (instrument, date_time)
    `;
    try {
      [pool_bitmex].forEach(pool => {
        pool.query(`
            CREATE TABLE IF NOT EXISTS composites(${schema});
            CREATE INDEX IF NOT EXISTS composites_idx ON composites (instrument, date_time);
        `);
        pool.query(`
            CREATE TABLE IF NOT EXISTS composites_m1(${schema});
            CREATE INDEX IF NOT EXISTS composites_m1_idx ON composites_m1 (instrument, date_time);
        `);
      });
    } catch (err) {
      throw new Error('Composite table schema error');
    }
  },
  async insertBitmexComposite(composites, table) {
    const sql = {
      insert: `INSERT INTO ${table} 
      (instrument, date_time, price)
      VALUES($1, $2, $3)
      ON CONFLICT DO NOTHING`,
    };
    try {
      composites.forEach(composite => {
        const { symbol, timestamp, lastPrice } = composite;
        pool_bitmex.query(sql.insert, [symbol, timestamp, lastPrice || 0]);
      });
    } catch (err) {
      throw new Error(err.detail);
    }
  },
  async selectComposites({
    database,
    interval,
    instrument,
    start_date,
    end_date,
  }) {
    const tables = {
      S5: 'composites',
      M1: 'composites_m1',
    };
    const sql = {
      select: `SELECT * FROM ${tables[interval]}
      WHERE instrument = $1
      AND date_time >= $2
      AND date_time <= $3
      LIMIT 5000;`,
    };
    try {
      if (database === 'bitmex') {
        res = await pool_bitmex.query(sql.select, [
          instrument,
          start_date,
          end_date,
        ]);
        return res.rows;
      }
      throw new Error('Invalid database composite query');
    } catch (err) {
      throw new Error('Select composite error');
    }
  },
  async aggregateComposites({
    instrument,
    from,
    into,
    truncate,
    start_date,
    end_date,
  }) {
    const sql = {
      insert: `INSERT INTO ${into}(instrument, date_time, price)
        SELECT instrument, 
        DATE_TRUNC('${truncate}', date_time) as composite_date_time,
        AVG(price) as avg_price
        FROM ${from}
        WHERE (instrument = '${instrument}')
        AND (date_time between '${start_date}' and '${end_date}')
        GROUP BY instrument, composite_date_time
        ON CONFLICT DO NOTHING;
      `,
    };
    try {
      [pool_bitmex].forEach(pool => {
        pool.query(sql.insert);
      });
    } catch (err) {
      throw new Error('candle aggregate error');
    }
  },
};
module.exports = CompositeModel;
