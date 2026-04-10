class Appointment {
  static async findAll(pool) {
    const [rows] = await pool.query(`
      SELECT a.*, p.first_name as patient_name, d.name as doctor_name, u.email as patient_email
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON p.user_id = u.id
      ORDER BY a.appointment_date DESC
    `);
    return rows;
  }

  static async findById(pool, id) {
    const [rows] = await pool.query(`
      SELECT a.*, p.first_name as patient_name, d.name as doctor_name, u.email as patient_email
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON p.user_id = u.id
      WHERE a.id = ?
    `, [id]);
    return rows[0];
  }

  static async findByPatientId(pool, patientId) {
    const [rows] = await pool.query(`
      SELECT a.*, d.name as doctor_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.patient_id = ?
      ORDER BY a.appointment_date DESC
    `, [patientId]);
    return rows;
  }

  static async findByDoctorId(pool, doctorId) {
    const [rows] = await pool.query(`
      SELECT a.*, p.first_name as patient_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.doctor_id = ?
      ORDER BY a.appointment_date DESC
    `, [doctorId]);
    return rows;
  }

  static async create(pool, appointmentData) {
    const { patient_id, doctor_id, appointment_date, reason, status } = appointmentData;
    const [result] = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [patient_id, doctor_id, appointment_date, reason, status || 'pending']
    );
    return result.insertId;
  }

  static async update(pool, id, appointmentData) {
    const { appointment_date, reason, status, notes } = appointmentData;
    await pool.query(
      `UPDATE appointments SET appointment_date = ?, reason = ?, status = ?, notes = ? 
       WHERE id = ?`,
      [appointment_date, reason, status, notes, id]
    );
    return true;
  }

  static async delete(pool, id) {
    await pool.query('DELETE FROM appointments WHERE id = ?', [id]);
    return true;
  }

  static async cancel(pool, id) {
    await pool.query("UPDATE appointments SET status = 'cancelled' WHERE id = ?", [id]);
    return true;
  }
}

module.exports = Appointment;
