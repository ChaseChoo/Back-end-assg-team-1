# Simple test to check server status
Write-Host "Checking server status..." -ForegroundColor Yellow

try {
    # Test if server is running
    $response = Invoke-WebRequest -Uri "http://localhost:3000/docs/medication.html" -Method GET -UseBasicParsing
    Write-Host "✅ Server is running (Status: $($response.StatusCode))" -ForegroundColor Green
    
    # Test login page
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3000/docs/user-login.html" -Method GET -UseBasicParsing
    Write-Host "✅ Login page accessible" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Server error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to: http://localhost:3000/docs/user-login.html" -ForegroundColor White
Write-Host "2. Log in with your credentials" -ForegroundColor White
Write-Host "3. Go to: http://localhost:3000/docs/add-medication.html" -ForegroundColor White
Write-Host "4. Add a test medication manually" -ForegroundColor White
Write-Host "5. Check: http://localhost:3000/docs/medication.html" -ForegroundColor White
