const sql = require('mssql');
const dbConfig = require('./dbConfig');
const jwt = require('jsonwebtoken');

async function testAppointmentBooking() {
    let connection;
    try {
        console.log('🔌 Connecting to database...');
        connection = await sql.connect(dbConfig);
        
        // Create a test JWT token for user ID 1
        const testToken = jwt.sign(
            { userId: 1, email: 'test@example.com' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '2h' }
        );
        
        console.log('🔑 Generated test token for user ID 1');
        
        // Test appointment data
        const appointmentData = {
            doctorId: 1,
            appointmentDate: '2025-08-10',
            appointmentTime: '10:00',
            notes: 'Test appointment booking'
        };
        
        console.log('📅 Testing appointment booking with data:', appointmentData);
        
        // Import the appointment model to test directly
        const appointmentModel = require('./models/appointmentModel');
        
        try {
            const result = await appointmentModel.createAppointment({
                userId: 1,
                ...appointmentData
            });
            console.log('✅ Appointment booking successful:', result);
        } catch (modelError) {
            console.error('❌ Appointment model error:', modelError.message);
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

testAppointmentBooking();
