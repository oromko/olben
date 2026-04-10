const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { authMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all appointments (Admin/Staff only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.findAll(global.dbPool);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient's appointments
router.get('/patient/:patientId', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.findByPatientId(global.dbPool, req.params.patientId);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor's appointments
router.get('/doctor/:doctorId', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.findByDoctorId(global.dbPool, req.params.doctorId);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single appointment
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(global.dbPool, req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create appointment
router.post('/', authMiddleware, [
  body('patient_id').notEmpty().withMessage('Patient ID is required'),
  body('doctor_id').notEmpty().withMessage('Doctor ID is required'),
  body('appointment_date').isISO8601().withMessage('Valid appointment date is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { patient_id, doctor_id, appointment_date, reason } = req.body;
    const appointmentId = await Appointment.create(global.dbPool, {
      patient_id,
      doctor_id,
      appointment_date,
      reason,
      status: 'pending'
    });

    res.status(201).json({ 
      message: 'Appointment created successfully',
      appointment: { id: appointmentId, patient_id, doctor_id, appointment_date, reason }
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { appointment_date, reason, status, notes } = req.body;
    await Appointment.update(global.dbPool, req.params.id, {
      appointment_date,
      reason,
      status,
      notes
    });

    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel appointment
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Appointment.cancel(global.dbPool, req.params.id);
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
