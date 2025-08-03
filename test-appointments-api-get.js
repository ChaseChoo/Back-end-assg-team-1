// Test the appointments API response format
const { default: fetch } = require('node-fetch');
const jwt = require('jsonwebtoken');

async function testAppointmentsAPI() {
    try {
        // Create a test JWT token for user ID 1
        const testToken = jwt.sign(
            { userId: 1, email: 'test@example.com' },
            process.env.JWT_ACCESS_SECRET || 'SilverConnect_SecretKey',
            { expiresIn: '2h' }
        );
        
        console.log('🔑 Testing appointments API...');
        
        const response = await fetch('http://localhost:3000/api/appointments', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${testToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📡 API Response Status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ API Response:', JSON.stringify(result, null, 2));
            console.log('🔍 Response type:', typeof result);
            console.log('🔍 Is Array?:', Array.isArray(result));
            if (result.appointments) {
                console.log('🔍 Appointments array length:', result.appointments.length);
                console.log('🔍 Appointments is array?:', Array.isArray(result.appointments));
            }
        } else {
            const error = await response.text();
            console.error('❌ API Error:', error);
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testAppointmentsAPI();
