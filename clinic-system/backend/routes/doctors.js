const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.findAll(global.dbPool);
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single doctor
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(global.dbPool, req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create doctor profile (Admin only)
router.post('/', authMiddleware, adminMiddleware, [
  body('user_id').notEmpty().withMessage('User ID is required'),
  body('specialization').notEmpty().withMessage('Specialization is required'),
  body('license_number').notEmpty().withMessage('License number is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user_id, specialization, license_number, experience, phone } = req.body;
    const doctorId = await Doctor.create(global.dbPool, {
      user_id,
      specialization,
      license_number,
      experience,
      phone
    });

    res.status(201).json({ 
      message: 'Doctor profile created successfully',
      doctor: { id: doctorId, user_id, specialization }
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update doctor profile (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { specialization, license_number, experience, phone } = req.body;
    await Doctor.update(global.dbPool, req.params.id, {
      specialization,
      license_number,
      experience,
      phone
    });

    res.json({ message: 'Doctor profile updated successfully' });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete doctor (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Doctor.delete(global.dbPool, req.params.id);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
