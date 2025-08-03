# Simple test to check server status
Write-Host "Checking server status..." -ForegroundColor Yellow

try {
    # Test if server is running
    $response = Invoke-WebRequest -Uri "http://localhost:3000/docs/medication.html" -Method GET -UseBasicParsing
    Write-Host "Server is running (Status: $($response.StatusCode))" -ForegroundColor Green
    
    # Test login page
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3000/docs/user-login.html" -Method GET -UseBasicParsing
    Write-Host "Login page accessible" -ForegroundColor Green
    
} catch {
    Write-Host "Server error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to add-medication page and manually add a medication" -ForegroundColor White
Write-Host "2. Then check the medication page to see if it appears" -ForegroundColor White
