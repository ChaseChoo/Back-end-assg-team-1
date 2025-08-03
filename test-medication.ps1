# PowerShell script to test and create medications
Write-Host "Testing Medication API..." -ForegroundColor Yellow

# First, let's check if server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/medication-records" -Method GET -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiY2hhc2UiLCJpYXQiOjE3MzM0MzAwMzYsImV4cCI6MTczMzQzMzYzNn0.dummy"
    } -UseBasicParsing
    
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
    
    # Parse the response
    $medications = $response.Content | ConvertFrom-Json
    
    if ($medications.Count -eq 0) {
        Write-Host "No medications found. Creating test medication..." -ForegroundColor Yellow
        
        # Create test medication
        $testMedication = @{
            medicationName = "Test Aspirin"
            dosage = "1 tablet"
            frequency = "After meals"
            iconType = "tablet"
            startDate = "2025-08-03"
            endDate = "2025-12-31"
            doseTimes = @("08:00", "20:00")
        } | ConvertTo-Json
        
        $createResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/medication" -Method POST -Headers @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiY2hhc2UiLCJpYXQiOjE3MzM0MzAwMzYsImV4cCI6MTczMzQzMzYzNn0.dummy"
        } -Body $testMedication -UseBasicParsing
        
        Write-Host "Create Status: $($createResponse.StatusCode)" -ForegroundColor Green
        Write-Host "Create Response: $($createResponse.Content)" -ForegroundColor Cyan
        
        if ($createResponse.StatusCode -eq 201) {
            Write-Host "✅ Test medication created successfully!" -ForegroundColor Green
            Write-Host "Now testing the API again..." -ForegroundColor Yellow
            
            # Test again
            $retestResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/medication-records" -Method GET -Headers @{
                "Content-Type" = "application/json"
                "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiY2hhc2UiLCJpYXQiOjE3MzM0MzAwMzYsImV4cCI6MTczMzQzMzYzNn0.dummy"
            } -UseBasicParsing
            
            Write-Host "Retest Response: $($retestResponse.Content)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "Found $($medications.Count) medications:" -ForegroundColor Green
        $medications | ForEach-Object {
            Write-Host "- $($_.medicationName)" -ForegroundColor White
        }
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`nDone! Check the medication page at: http://localhost:3000/docs/medication.html" -ForegroundColor Yellow
