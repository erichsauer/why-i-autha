const pool = require('../utils/pool');

module.exports = class GithubUser {
  id;
  username;
  email;
  avatar;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
    this.avatar = row.avatar;
  }

  static async insert({ login, email, avatar_url }) {
    if (!login) throw new Error('Username is required');

    const { rows } = await pool.query(
      `
      INSERT INTO github_users (username, email, avatar)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [login, email, avatar_url]
    );

    return new GithubUser(rows[0]);
  }

  static async findByUsername(login) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM github_users
      WHERE username=$1
      `,
      [login]
    );

    if (!rows[0]) return null;

    return new GithubUser(rows[0]);
  }

  toJSON() {
    return { ...this };
  }
};
