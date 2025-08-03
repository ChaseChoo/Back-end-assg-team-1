# PowerShell script to update ALL HTML pages for simple translation

$htmlFiles = Get-ChildItem -Path "docs" -Filter "*.html"

foreach ($file in $htmlFiles) {
    Write-Host "Updating: $($file.Name)"
    
    $content = Get-Content $file.FullName -Raw
    
    # Remove old i18n scripts and replace with simple translator
    $content = $content -replace '<!-- i18n Support -->.*?<script src="js/language-switcher\.js"></script>', '<!-- Simple Translation System -->
    <script src="js/simple-translator.js"></script>
    <script src="js/simple-language-switcher.js"></script>'
    
    # Remove old translation script includes
    $content = $content -replace '<script src="js/translations/en\.js"></script>', ''
    $content = $content -replace '<script src="js/translations/zh\.js"></script>', ''
    $content = $content -replace '<script src="js/i18n\.js"></script>', ''
    $content = $content -replace '<script src="js/language-switcher\.js"></script>', ''
    
    # Remove all data-i18n attributes but keep the text
    $content = $content -replace '\s*data-i18n="[^"]*"', ''
    $content = $content -replace '\s*data-i18n-placeholder="[^"]*"', ''
    
    # Add simple translation system if not present
    if ($content -notmatch 'simple-translator\.js') {
        $content = $content -replace '(<!-- css/style\.css CSS linking-->.*?<link rel="stylesheet" href="css/style\.css">)', '$1
    
    <!-- Simple Translation System -->
    <script src="js/simple-translator.js"></script>
    <script src="js/simple-language-switcher.js"></script>'
    }
    
    # Clean up any duplicate empty lines
    $content = $content -replace '\n\s*\n\s*\n', "`n`n"
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}

Write-Host "All HTML files updated for simple translation!"
