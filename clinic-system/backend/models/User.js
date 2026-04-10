const bcrypt = require('bcryptjs');

class User {
  static async findAll(pool) {
    const [rows] = await pool.query('SELECT id, username, email, role, created_at FROM users');
    return rows;
  }

  static async findById(pool, id) {
    const [rows] = await pool.query('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByEmail(pool, email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(pool, userData) {
    const { username, email, password, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role || 'patient']
    );
    return result.insertId;
  }

  static async update(pool, id, userData) {
    const { username, email, role } = userData;
    await pool.query(
      'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
      [username, email, role, id]
    );
    return true;
  }

  static async delete(pool, id) {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;
