# PowerShell script to replace broken logo URLs with local SVG
$filesToFix = @(
    "index.html", "medication.html", "user-login.html", "user-settings.html", 
    "meal-logging.html", "book-appointment.html", "healthcare-appointments.html",
    "add-medication.html", "family-management.html", "credits.html", 
    "schedule-medication.html", "medication-inventory.html"
)

$brokenUrl = 'https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-fad8-61f7-a183-79614682dfc0/raw?se=2025-08-03T09%3A59%3A42Z&sp=r&sv=2024-08-04&sr=b&scid=c73924e0-4a00-5c7d-9d2d-0abd9e6afc60&skoid=f28c0102-4d9d-4950-baf0-4a8e5f6cf9d4&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-08-02T19%3A16%3A31Z&ske=2025-08-03T19%3A16%3A31Z&sks=b&skv=2024-08-04&sig=8KGMUkxZphariwbOP6vq3HtEGgTsEcXfsdu1/LdnTjQ%3D'
$newUrl = 'assets/silverconnect-logo.svg'

foreach ($file in $filesToFix) {
    if (Test-Path $file) {
        Write-Host "Fixing $file..."
        (Get-Content $file -Raw) -replace [regex]::Escape($brokenUrl), $newUrl | Set-Content $file -NoNewline
    }
}

Write-Host "Logo URLs fixed in all HTML files!"
