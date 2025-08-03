# Script to restore simple translation keys across all HTML files

$htmlFiles = Get-ChildItem -Path "docs" -Filter "*.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    Write-Host "Processing: $($file.Name)"
    
    # Restore simple navigation keys
    $content = $content -replace 'data-i18n="nav[A-Z][a-zA-Z]*"', 'data-i18n="meal-logging"' -replace 'href="meal-logging.html"[^>]*data-i18n="[^"]*"', 'href="meal-logging.html" data-i18n="meal-logging"'
    $content = $content -replace 'href="medication\.html"[^>]*data-i18n="[^"]*"', 'href="medication.html" data-i18n="medication-tracker"'
    $content = $content -replace 'href="medication-inventory\.html"[^>]*data-i18n="[^"]*"', 'href="medication-inventory.html" data-i18n="medicine-inventory"'
    $content = $content -replace 'href="family-management\.html"[^>]*data-i18n="[^"]*"', 'href="family-management.html" data-i18n="family-support"'
    $content = $content -replace 'href="healthcare-appointments\.html"[^>]*data-i18n="[^"]*"', 'href="healthcare-appointments.html" data-i18n="manage-appointment"'
    
    # Fix common weird keys
    $content = $content -replace 'data-i18n="[a-zA-Z]*[Tt]itle"', 'data-i18n="login-title"' -replace 'Login', 'Login'
    $content = $content -replace 'data-i18n="[a-zA-Z]*[Ee]mail"', 'data-i18n="email"'
    $content = $content -replace 'data-i18n="[a-zA-Z]*[Pp]assword"', 'data-i18n="password"'
    $content = $content -replace 'data-i18n="[a-zA-Z]*[Uu]sername"', 'data-i18n="username"'
    $content = $content -replace 'data-i18n="[a-zA-Z]*[Bb]utton"', 'data-i18n="save"'
    
    Set-Content -Path $file.FullName -Value $content
}

Write-Host "All files updated!"
