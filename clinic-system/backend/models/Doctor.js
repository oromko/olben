class Doctor {
  static async findAll(pool) {
    const [rows] = await pool.query(`
      SELECT d.*, u.username, u.email 
      FROM doctors d 
      JOIN users u ON d.user_id = u.id
    `);
    return rows;
  }

  static async findById(pool, id) {
    const [rows] = await pool.query(`
      SELECT d.*, u.username, u.email 
      FROM doctors d 
      JOIN users u ON d.user_id = u.id 
      WHERE d.id = ?
    `, [id]);
    return rows[0];
  }

  static async findByUserId(pool, userId) {
    const [rows] = await pool.query('SELECT * FROM doctors WHERE user_id = ?', [userId]);
    return rows[0];
  }

  static async create(pool, doctorData) {
    const { user_id, specialization, license_number, experience, phone } = doctorData;
    const [result] = await pool.query(
      `INSERT INTO doctors (user_id, specialization, license_number, experience, phone) 
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, specialization, license_number, experience || 0, phone]
    );
    return result.insertId;
  }

  static async update(pool, id, doctorData) {
    const { specialization, license_number, experience, phone } = doctorData;
    await pool.query(
      `UPDATE doctors SET specialization = ?, license_number = ?, experience = ?, phone = ? 
       WHERE id = ?`,
      [specialization, license_number, experience, phone, id]
    );
    return true;
  }

  static async delete(pool, id) {
    await pool.query('DELETE FROM doctors WHERE id = ?', [id]);
    return true;
  }
}

module.exports = Doctor;
