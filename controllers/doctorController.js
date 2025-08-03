// doctorController.js
const doctorModel = require('../models/doctorModel');

// GET /api/doctors (supports optional appointmentTypeId and clinicId query params)
async function getDoctors(req, res) {
  try {
    const appointmentTypeId = req.query.appointmentTypeId ? parseInt(req.query.appointmentTypeId) : undefined;
    const clinicId = req.query.clinicId ? parseInt(req.query.clinicId) : undefined;
    const doctors = await doctorModel.getDoctors(appointmentTypeId, clinicId);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctors.' });
  }
}

module.exports = {
  getDoctors
};
