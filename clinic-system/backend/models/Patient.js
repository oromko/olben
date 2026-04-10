class Patient {
  static async findAll(pool) {
    const [rows] = await pool.query(`
      SELECT p.*, u.username, u.email 
      FROM patients p 
      JOIN users u ON p.user_id = u.id
    `);
    return rows;
  }

  static async findById(pool, id) {
    const [rows] = await pool.query(`
      SELECT p.*, u.username, u.email 
      FROM patients p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }

  static async findByUserId(pool, userId) {
    const [rows] = await pool.query('SELECT * FROM patients WHERE user_id = ?', [userId]);
    return rows[0];
  }

  static async create(pool, patientData) {
    const { user_id, date_of_birth, gender, phone, address, medical_history } = patientData;
    const [result] = await pool.query(
      `INSERT INTO patients (user_id, date_of_birth, gender, phone, address, medical_history) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, date_of_birth, gender, phone, address, JSON.stringify(medical_history || [])]
    );
    return result.insertId;
  }

  static async update(pool, id, patientData) {
    const { date_of_birth, gender, phone, address, medical_history } = patientData;
    await pool.query(
      `UPDATE patients SET date_of_birth = ?, gender = ?, phone = ?, address = ?, medical_history = ? 
       WHERE id = ?`,
      [date_of_birth, gender, phone, address, JSON.stringify(medical_history), id]
    );
    return true;
  }

  static async delete(pool, id) {
    await pool.query('DELETE FROM patients WHERE id = ?', [id]);
    return true;
  }
}

module.exports = Patient;
