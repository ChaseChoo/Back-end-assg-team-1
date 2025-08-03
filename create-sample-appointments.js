const sql = require('mssql');
const dbConfig = require('./dbConfig');

const sampleAppointments = [
    {
        userId: 1, // testuser
        doctorId: 1, // Dr. Sarah Chen
        appointmentDate: '2025-08-05',
        appointmentTime: '10:00:00',
        notes: 'Annual health checkup',
        status: 'Scheduled'
    },
    {
        userId: 1,
        doctorId: 2, // Dr. Michael Wong
        appointmentDate: '2025-08-07',
        appointmentTime: '14:30:00',
        notes: 'Follow-up for heart condition',
        status: 'Scheduled'
    },
    {
        userId: 1,
        doctorId: 3, // Dr. Lisa Kim
        appointmentDate: '2025-07-28',
        appointmentTime: '09:30:00',
        notes: 'Diabetes consultation',
        status: 'Completed'
    },
    {
        userId: 1,
        doctorId: 4, // Dr. James Lim
        appointmentDate: '2025-08-10',
        appointmentTime: '11:00:00',
        notes: 'Knee pain examination',
        status: 'Scheduled'
    }
];

async function createSampleAppointments() {
    let connection;
    try {
        console.log('🔌 Connecting to database...');
        connection = await sql.connect(dbConfig);
        
        console.log('🩺 Creating sample appointments...');
        
        for (const appointment of sampleAppointments) {
            // Convert time string to proper Date object for sql.Time
            const [hours, minutes, seconds] = appointment.appointmentTime.split(':').map(Number);
            const timeDate = new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds || 0));
            
            await connection.request()
                .input('userId', sql.Int, appointment.userId)
                .input('doctorId', sql.Int, appointment.doctorId)
                .input('appointmentDate', sql.Date, appointment.appointmentDate)
                .input('appointmentTime', sql.Time, timeDate)
                .input('notes', sql.VarChar(500), appointment.notes)
                .input('status', sql.VarChar(50), appointment.status)
                .query(`
                    INSERT INTO Appointments (userId, doctorId, appointmentDate, appointmentTime, notes, status, createdAt)
                    VALUES (@userId, @doctorId, @appointmentDate, @appointmentTime, @notes, @status, GETDATE())
                `);
        }
        
        console.log('✅ Sample appointments created successfully!');
        
        // Show summary
        const result = await connection.request().query(`
            SELECT 
                a.appointmentId,
                d.doctorName,
                a.appointmentDate,
                a.appointmentTime,
                a.status
            FROM Appointments a
            JOIN Doctors d ON a.doctorId = d.doctorId
            WHERE a.userId = 1
            ORDER BY a.appointmentDate
        `);
        
        console.log('\n📅 Created appointments:');
        result.recordset.forEach(apt => {
            console.log(`  ${apt.appointmentId}: ${apt.doctorName} - ${apt.appointmentDate} at ${apt.appointmentTime} (${apt.status})`);
        });
        
    } catch (error) {
        console.error('❌ Error creating appointments:', error);
    } finally {
        if (connection) {
            await connection.close();
            console.log('🔒 Database connection closed.');
        }
    }
}

createSampleAppointments();
