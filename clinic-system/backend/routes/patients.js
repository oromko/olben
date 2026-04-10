const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all patients (Admin/Staff only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const patients = await Patient.findAll(global.dbPool);
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single patient
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(global.dbPool, req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create patient profile
router.post('/', authMiddleware, [
  body('user_id').notEmpty().withMessage('User ID is required'),
  body('date_of_birth').optional().isISO8601(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, date_of_birth, gender, phone, address, medical_history } = req.body;
    const patientId = await Patient.create(global.dbPool, {
      user_id,
      date_of_birth,
      gender,
      phone,
      address,
      medical_history
    });

    res.status(201).json({ 
      message: 'Patient profile created successfully',
      patient: { id: patientId, user_id }
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { date_of_birth, gender, phone, address, medical_history } = req.body;
    await Patient.update(global.dbPool, req.params.id, {
      date_of_birth,
      gender,
      phone,
      address,
      medical_history
    });

    res.json({ message: 'Patient profile updated successfully' });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete patient
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Patient.delete(global.dbPool, req.params.id);
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
