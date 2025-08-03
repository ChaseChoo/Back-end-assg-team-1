# PowerShell Script to Update All HTML Pages with Modern Design
# modernize-all-pages.ps1

Write-Host "Starting modernization of all HTML pages..." -ForegroundColor Green

# Define the HTML files to update
$htmlFiles = @(
    "docs\user-login.html",
    "docs\user-registration.html", 
    "docs\user-settings.html",
    "docs\medication.html",
    "docs\add-medication.html",
    "docs\schedule-medication.html",
    "docs\medication-inventory.html",
    "docs\family-management.html",
    "docs\healthcare-appointments.html",
    "docs\book-appointment.html",
    "docs\appointment-list.html",
    "docs\meal-logging.html",
    "docs\credits.html"
)

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        Write-Host "Updating $file..." -ForegroundColor Yellow
        
        # Read the file content
        $content = Get-Content $file -Raw
        
        # Update the head section with modern fonts and meta tags
        $content = $content -replace '<title>([^<]+)</title>', '<title>$1 - SilverConnect</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">'
        
        # Update navbar brand to use modern icon instead of image
        $content = $content -replace '<img src="assets/MerderkaLife\.png"[^>]*>', '<div class="modern-feature-icon me-3" style="width: 50px; height: 50px; font-size: 1.2rem;">
                    <i class="bi bi-heart-pulse"></i>
                </div>
                <span class="fw-bold fs-4 text-gradient">SilverConnect</span>'
        
        # Update navigation classes to modern style
        $content = $content -replace 'class="navbar navbar-expand-lg bg-white shadow-sm sticky-top"', 'class="navbar navbar-expand-lg sticky-top"'
        
        # Update button classes to modern style
        $content = $content -replace 'btn-colour', 'btn-modern-primary'
        $content = $content -replace 'btn btn-primary', 'btn btn-modern-primary'
        $content = $content -replace 'btn btn-secondary', 'btn btn-modern-secondary'
        $content = $content -replace 'btn btn-outline-primary', 'btn btn-modern-outline'
        
        # Update form classes to modern style
        $content = $content -replace 'class="form-control"', 'class="form-control form-control-modern"'
        $content = $content -replace 'class="form-label"', 'class="form-label form-label-modern"'
        
        # Update card classes to modern style
        $content = $content -replace 'class="card"', 'class="card glass-card"'
        
        # Add modern CSS animations to key elements
        $content = $content -replace '<div class="container">', '<div class="container animate-fade-up">'
        
        # Write the updated content back to the file
        Set-Content $file $content -Encoding UTF8
        
        Write-Host "Success: $file updated successfully" -ForegroundColor Green
    } else {
        Write-Host "Warning: File not found: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "All HTML pages have been modernized!" -ForegroundColor Green
Write-Host "Modern design features added:" -ForegroundColor Cyan
Write-Host "- Google Fonts (Inter)" -ForegroundColor White
Write-Host "- Modern gradient buttons" -ForegroundColor White  
Write-Host "- Glassmorphism cards" -ForegroundColor White
Write-Host "- Modern navigation icons" -ForegroundColor White
Write-Host "- Enhanced form styling" -ForegroundColor White
Write-Host "- Fade-up animations" -ForegroundColor White
