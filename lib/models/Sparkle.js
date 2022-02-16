const pool = require('../utils/pool');

module.exports = class Sparkle {
  id;
  text;
  userId;

  constructor(row) {
    this.id = row.id;
    this.text = row.text;
    this.userId = row.user_id;
  }

  static async insert({ text, userId }) {
    const { rows } = await pool.query(
      'INSERT INTO sparkles (text, user_id) VALUES ($1, $2) RETURNING *',
      [text, userId]
    );

    return new Sparkle(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * from sparkles');
    return rows.map((row) => new Sparkle(row));
  }
};
