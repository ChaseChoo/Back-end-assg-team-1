// Test appointment booking via API
const { default: fetch } = require('node-fetch');
const jwt = require('jsonwebtoken');

async function testAppointmentAPI() {
    try {
        // Create a test JWT token for user ID 1
        const testToken = jwt.sign(
            { userId: 1, email: 'test@example.com' },
            process.env.JWT_ACCESS_SECRET || 'SilverConnect_SecretKey',
            { expiresIn: '2h' }
        );
        
        console.log('🔑 Using test token for API request');
        
        // Test appointment data
        const appointmentData = {
            doctorId: 1,
            appointmentDate: '2025-08-11',
            appointmentTime: '14:00',
            notes: 'API test appointment'
        };
        
        console.log('📅 Testing appointment booking via API:', appointmentData);
        
        const response = await fetch('http://localhost:3000/api/appointments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${testToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
        });
        
        console.log('📡 API Response Status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ API Success:', result);
        } else {
            const error = await response.text();
            console.error('❌ API Error:', error);
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testAppointmentAPI();
