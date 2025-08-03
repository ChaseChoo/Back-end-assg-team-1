# Quick fix for missing translation scripts
$docsPath = "c:\Users\chase\Downloads\SilverConnect-Clean\docs"

# List of pages that need translation scripts
$pages = @(
    "add-medication.html",
    "credits.html", 
    "healthcare-appointments.html",
    "meal-logging.html",
    "medication.html",
    "medication-inventory.html",
    "schedule-medication.html",
    "user-login.html",
    "user-registration.html", 
    "user-settings.html",
    "family-management.html"
)

foreach ($page in $pages) {
    $filePath = Join-Path $docsPath $page
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Check if translation scripts are missing
        if ($content -notmatch "simple-translator\.js" -and $content -notmatch "simple-language-switcher\.js") {
            Write-Host "Adding translation scripts to: $page"
            
            # Add translation scripts after the style.css line
            $content = $content -replace "(`<link rel=`"stylesheet`" href=`"css/style\.css`"`>)", "`$1`r`n    `r`n    <!-- Simple Translation System -->`r`n    <script src=`"js/simple-translator.js`"></script>`r`n    <script src=`"js/simple-language-switcher.js`"></script>"
            
            # Write back to file
            Set-Content -Path $filePath -Value $content -Encoding UTF8
        } else {
            Write-Host "Translation scripts already present in: $page"
        }
    }
}

Write-Host "Translation script fix completed!"
