# Fix authentication token consistency across all pages
$docsPath = "c:\Users\chase\Downloads\SilverConnect-Clean\docs"

# Get all HTML files
$htmlFiles = Get-ChildItem -Path $docsPath -Filter "*.html"

foreach ($file in $htmlFiles) {
    $filePath = $file.FullName
    $content = Get-Content $filePath -Raw
    
    # Check if the file contains the wrong token reference
    if ($content -match "sessionStorage\.getItem\('token'\)") {
        Write-Host "Fixing authentication token in: $($file.Name)"
        
        # Replace 'token' with 'authToken' for consistency
        $content = $content -replace "sessionStorage\.getItem\('token'\)", "sessionStorage.getItem('authToken')"
        
        # Write back to file
        Set-Content -Path $filePath -Value $content -Encoding UTF8
    }
}

Write-Host "Authentication token fix completed!"
