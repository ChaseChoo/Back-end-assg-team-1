const appointmentModel = require('../models/appointmentModel'); // Import appointmentModel for DB operations 

// (POST) Create a new appointment for a user 
/**
 * What this functions does:
 * 1. Recieves appointment details from the request body
 * 2. Calls the model function to check and insert the new appointment 
 * 3. Returns success response with appointment details or error message
 */
const createAppointment = async (req, res) => {
  try {

    const userId = req.user.userId; // Extract userId from JWT
    const { doctorId, appointmentTypeId, appointmentDate, appointmentTime, notes } = req.body;

    // Insert new appointment using model function
    const newAppointment = await appointmentModel.createAppointment({
      userId,
      doctorId,
      appointmentTypeId,
      appointmentDate,
      appointmentTime,
      notes
    });

    // Send back 201 Created status and the new appointment data
    res.status(201).json(newAppointment);
  } catch (error) {
    // Log error for debugging
    console.error('Error creating appointment:', error);

    // Respond with detailed error message for easier debugging
    res.status(500).json({ error: error.message || 'Failed to create appointment' });
  }
};

// (GET) Get all appointments for the currently logged-in user
/**
 * What this function does:
 * 1. Extracts userId from the request (assumes authentication middleware added it)
 * 2. Calls model function to fetch user's appointments
 * 3. Returns the list of appointments, or a message if the user has none
 */
const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.userId; // Always take userId from JWT token

    // Fetch appointments for the specific user
    const appointments = await appointmentModel.getAppointmentsByUser(userId);

    // Return the list of appointments or a friendly message if none
    if (!appointments || appointments.length === 0) {
      return res.json({ appointments: [], message: 'No bookings at the moment.' });
    }

    res.json({ appointments });
  } catch (error) {
    // Log the error
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch user appointments' });
  }
};

/**
 * (PUT) Update an existing appointment
 * What this function does:
 * 1. Extracts appointment ID from route params
 * 2. Receives updated appointmentDate, appointmentTime, notes from request body
 * 3. Calls model function to update the appointment (with double booking check)
 * 4. Returns updated appointment or error message
 */
const updateAppointment = async (req, res) => {
  try {
    console.log('DEBUG updateAppointment: req.params =', req.params);
    const appointmentId = parseInt(req.params.id);
    console.log('DEBUG updateAppointment: appointmentId =', appointmentId);
    const userId = req.user.userId; // Extract userId from JWT

    if (!appointmentId || isNaN(appointmentId)) {
      return res.status(400).json({ error: 'Invalid appointment ID', received: req.params.id });
    }

    // Fetch the appointment to check ownership
    const appointment = await appointmentModel.getAppointmentById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    if (appointment.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this appointment' });
    }

    // Only allow appointmentDate, appointmentTime, notes to be updated
    const { appointmentDate, appointmentTime, notes } = req.body;

    // Call model function to update appointment (pass fields as object)
    const updatedAppointment = await appointmentModel.updateAppointment(appointmentId, { appointmentDate, appointmentTime, notes });
    console.log('DEBUG updatedAppointment:', updatedAppointment);

    res.json({ success: true, message: 'Appointment updated successfully', appointment: updatedAppointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: error.message || 'Failed to update appointment' });
  }
};

/**
 * (DELETE) Delete an appointment by appointmentId
 * What this function does:
 * 1. Extracts appointmentId from route params
 * 2. Calls model function to delete the appointment
 * 3. Returns success message or error
 */
const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = parseInt(req.params.id);
    const userId = req.user.userId; // Extract userId from JWT

    if (!appointmentId || isNaN(appointmentId)) {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }

    // Fetch the appointment to check ownership
    const appointment = await appointmentModel.getAppointmentById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    if (appointment.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this appointment' });
    }

    const result = await appointmentModel.deleteAppointment(appointmentId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: error.message || 'Failed to delete appointment' });
  }
};

// Export controller functions so they can be used in route files
module.exports = {
  createAppointment,
  getUserAppointments,
  updateAppointment,
  deleteAppointment,
};
