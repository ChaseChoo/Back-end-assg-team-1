# PowerShell script to update all translation keys to flat structure

# Get all HTML files
$htmlFiles = Get-ChildItem -Path "docs" -Filter "*.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Navigation updates
    $content = $content -replace 'data-i18n="nav\.([^"]+)"', 'data-i18n="nav$1"'
    
    # Button updates  
    $content = $content -replace 'data-i18n="buttons\.([^"]+)"', 'data-i18n="button$1"'
    
    # Homepage updates
    $content = $content -replace 'data-i18n="homepage\.title"', 'data-i18n="homepageTitle"'
    $content = $content -replace 'data-i18n="homepage\.features\.trackMedication\.title"', 'data-i18n="homepageTrackMedicationTitle"'
    $content = $content -replace 'data-i18n="homepage\.features\.trackMedication\.description"', 'data-i18n="homepageTrackMedicationDesc"'
    $content = $content -replace 'data-i18n="homepage\.features\.medicineInventory\.title"', 'data-i18n="homepageMedicineInventoryTitle"'
    $content = $content -replace 'data-i18n="homepage\.features\.medicineInventory\.description"', 'data-i18n="homepageMedicineInventoryDesc"'
    $content = $content -replace 'data-i18n="homepage\.features\.mealLogging\.title"', 'data-i18n="homepageMealLoggingTitle"'
    $content = $content -replace 'data-i18n="homepage\.features\.mealLogging\.description"', 'data-i18n="homepageMealLoggingDesc"'
    $content = $content -replace 'data-i18n="homepage\.features\.appointments\.title"', 'data-i18n="homepageAppointmentsTitle"'
    $content = $content -replace 'data-i18n="homepage\.features\.appointments\.description"', 'data-i18n="homepageAppointmentsDesc"'
    $content = $content -replace 'data-i18n="homepage\.features\.familySupport\.title"', 'data-i18n="homepageFamilySupportTitle"'
    $content = $content -replace 'data-i18n="homepage\.features\.familySupport\.description"', 'data-i18n="homepageFamilySupportDesc"'
    $content = $content -replace 'data-i18n="homepage\.features\.aiAssistant\.title"', 'data-i18n="homepageAiAssistantTitle"'
    $content = $content -replace 'data-i18n="homepage\.features\.aiAssistant\.description"', 'data-i18n="homepageAiAssistantDesc"'
    
    # Login updates (already done but double-check)
    $content = $content -replace 'data-i18n="login\.([^"]+)"', 'data-i18n="login$1"'
    
    # Register updates (already done but double-check)
    $content = $content -replace 'data-i18n="register\.([^"]+)"', 'data-i18n="register$1"'
    
    # Profile updates (already done but double-check)
    $content = $content -replace 'data-i18n="profile\.([^"]+)"', 'data-i18n="profile$1"'
    
    # Inventory updates
    $content = $content -replace 'data-i18n="inventory\.([^"]+)"', 'data-i18n="inventory$1"'
    
    # Messages updates
    $content = $content -replace 'data-i18n="messages\.([^"]+)"', 'data-i18n="message$1"'
    
    # Medication updates
    $content = $content -replace 'data-i18n="medication\.([^"]+)"', 'data-i18n="medication$1"'
    
    # Meals updates
    $content = $content -replace 'data-i18n="meals\.([^"]+)"', 'data-i18n="meals$1"'
    
    # Appointments updates
    $content = $content -replace 'data-i18n="appointments\.([^"]+)"', 'data-i18n="appointments$1"'
    
    # Family updates
    $content = $content -replace 'data-i18n="family\.([^"]+)"', 'data-i18n="family$1"'
    
    # Write the updated content back
    Set-Content -Path $file.FullName -Value $content
    
    Write-Host "Updated: $($file.Name)"
}

Write-Host "All HTML files updated with flat translation structure!"
